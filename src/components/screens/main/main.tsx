"use client";

import { CoinEmoji as EmojiType } from "@/types/coinEmoji";

import { webAppContext } from "@/app/context"
import { LoadingContext } from '@/app/context/LoaderContext'
import Loader from '@/components/loader/loader'
import supabase from "@/db/supabase"
import { AppDispatch } from '@/store/store'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserEnergy, updateUserScores } from '../../../store/userSlice'
import Emoji from './Emoji'
import styles from './Main.module.css'
import CoinEmojis from "./CoinEmojis";

import { throttle } from "@/utils/throttle";
import { Modal } from "@/components/modal/Modal";

import { PRIZES, RULES } from "@/constants/rules";
import { Prize, Rule } from "@/components/rule/Rule";
import { Popup } from "@/components/popup/Popup";
import { PopupProps } from "@/types/popup";
import { showPopup } from "@/utils/showPopup";

interface RootState {
    user: {
        data: any;
    }
}

type ClickType = {
    id: number;
    x: number;
    y: number;
    value: number; // Добавляем значение для отображения
};

const CoinMania: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const {app} = useContext(webAppContext);
    const userData = useSelector((state: RootState) => state.user.data);
    const { isLoading, setLoading } = useContext(LoadingContext);
    const [error, setError] = useState<string | null>(null);

    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

    const [isPressed, setIsPressed] = useState(false);
    const [coinEmojis, setCoinEmojis] = useState<EmojiType[]>([]);
    const [clicks, setClicks] = useState<ClickType[]>([]);
    const lastTapTimeRef = useRef<number>(Date.now());
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const headerAnimationSpeedRef = useRef(0.4);
    const coinRef = useRef<HTMLDivElement>(null);
    const consecutiveTapsRef = useRef(0);
    
    const [emogis, setEmogis] = useState<string[]>([])
    const [speed, setSpeed] = useState(1);

    const [openRules, setOpenRules] = useState(false);
    const [openPrizes, setOpenPrizes] = useState(false);

    const handleButtonClickSpeed = () => {
        setSpeed((prevSpeed) => (prevSpeed >= 5 ? 5 : prevSpeed + 1)); // Ограничиваем скорость до 5
      };

    const [coinSize, setCoinSize] = useState(360); // Добавляем состояние для размера монеты
    const [showLowEnergyPopup, setShowLowEnergyPopup] = useState([false, null] as [boolean, null | NodeJS.Timeout])

    const popupNegative: PopupProps = {
        pic: "info",
        text: "Не достаточно энергии",
    }

    useEffect(() => {
        const updateCoinSize = () => {
            if (window.innerWidth <= 375) { // Размер для iPhone SE
                setCoinSize(200);
            } else { // Размер для всех других устройств
                setCoinSize(360);
            }
        };

        // Устанавливаем размер монеты при загрузке страницы
        updateCoinSize();

        // Обновляем размер монеты при изменении размера окна
        window.addEventListener('resize', updateCoinSize);
        return () => {
            window.removeEventListener('resize', updateCoinSize);
        };
    }, []);

    const throttledSyncWithDB = useCallback(throttle(async (scores: number, energy: number) => {
        try {
            const response = await fetch(`/api/user/sync`, {
                method: 'POST',
                body: JSON.stringify({
                    id: userData.id,
                    energy: energy,
                    scores: scores,
                })
            })
            
            const data = await response.json();

            if (data.error) {
                throw new Error('Error syncing data')
            }
        } catch (error: unknown) {
            console.error('Error syncing data: ', error);
        }
    }, 2000), []);

    useEffect(() => {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(isTouch);
    }, [])

    const handleCoinTap = async (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
        let tapValueMultiplier = 1;
        let energyToDecrease = 1;

        if (userData) {
            const userTapValue = userData.upgrades.tap_value || 1;
            const userEnergy = userData.energy;

            tapValueMultiplier = tapValueMultiplier * userTapValue;
            energyToDecrease = energyToDecrease * userTapValue;

            const tapBoostRemainingTime = userData.tap_boost_remaining_time;
            const isBoosterActive = tapBoostRemainingTime > 0;
            
            if (isBoosterActive) {
                tapValueMultiplier = tapValueMultiplier * 5;
            }

            if (userEnergy < userTapValue) {
                showPopup({state: showLowEnergyPopup, setState: setShowLowEnergyPopup})
            }
        }

        if (userData.energy <= 0 || energyToDecrease > userData.energy) return;

        const pointsToAdd = 1 * tapValueMultiplier; // Значение с учетом бустера

        const newScoresValue = userData.scores + pointsToAdd;
        const newEnergyValue = Math.min(userData.energy - energyToDecrease, userData?.maxenergy ?? 0);

        dispatch(updateUserScores(newScoresValue));
        dispatch(updateUserEnergy(newEnergyValue));// Уменьшаем энергию, не превышая maxenergy

        const rect = coinRef.current?.getBoundingClientRect();
        if (rect) {
            let clientX, clientY;
            if ('changedTouches' in e) {      
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            addCoinEmojis(x, y);
            setClicks(prev => [...prev, { id: Date.now(), x, y, value: pointsToAdd }]); // Добавляем значение

            handleButtonClickSpeed();
        }

        throttledSyncWithDB(newScoresValue, newEnergyValue);
    }

    const handleButtonClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
        if (!isTouchDevice) {
            handleCoinTap(e);
        }
    };

    const handleAnimationEnd = (id: number) => {
        setClicks(prevClicks => prevClicks.filter(click => click.id !== id));
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        setIsPressed(true);
        handleTilt(e);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
        setTilt({ x: 0, y: 0 });     
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsPressed(false);
        setTilt({ x: 0, y: 0 });
        if (isTouchDevice) {
            handleCoinTap(e);
        }
    }

    const handleTilt = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (coinRef.current) {
            const rect = coinRef.current.getBoundingClientRect();
            let clientX, clientY;
            if ('touches' in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            const x = clientX - rect.left - rect.width / 2;
            const y = clientY - rect.top - rect.height / 2;
            const tiltX = -(y / rect.height) * 40;
            const tiltY = (x / rect.width) * 40;
            setTilt({ x: tiltX, y: tiltY });
        }
    };

    function handleRulesButtonClick() {
        setOpenRules(true);
    }
    function handlePrizesButtonClick() {
        setOpenPrizes(true);
    }
    function handleCloseRules() {
        setOpenRules(false);
    }
    function handleClosePrizes() {
        setOpenPrizes(false);
    }

    const getRandomBgEmoji = () => {
        const emojis = ['🎉', '⭐', '💥', '🚀', '🎤', '🔥'];

        const filledArray = [];

        for (let i = 0; i < 12; i++) {
            filledArray.push(emojis[Math.floor(Math.random() * emojis.length)]);
        }
        setEmogis(filledArray)
    };

    const getRandomEmoji = () => {
        const emojis = ['🎉', '⭐', '💥', '🚀', '🎤', '🔥'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    };

    const addCoinEmojis = useCallback((x: number, y: number) => {
        const currentTime = Date.now();
        if (currentTime - lastTapTimeRef.current > 1000) {
            consecutiveTapsRef.current = 0;
        }
        consecutiveTapsRef.current++;

        if (consecutiveTapsRef.current >= 16 && consecutiveTapsRef.current % 16 === 0) {
            const newEmojis = Array(8).fill(null).map(() => ({
                id: String(Date.now()) + String(Math.random()),
                emoji: getRandomEmoji(),
                x: x + (Math.random() - 0.5) * 60,
                y: y + (Math.random() - 0.5) * 60,
                size: Math.random() * 24 + 14,
                speedX: (Math.random() - 0.5) * 100,
                speedY: -(Math.random() * 200 + 100),
                createdAt: currentTime // Обновляем createdAt
            }));
            setCoinEmojis(prev => [...prev, ...newEmojis]);
        }
        lastTapTimeRef.current = currentTime;
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentTime = Date.now();
            const timeSinceLastTap = currentTime - lastTapTimeRef.current;

            if (timeSinceLastTap > 2000) {
                setSpeed((currentSpeed) => {
                    return currentSpeed > 1
                        ? currentSpeed - 1
                        : 1;
                })
            }
        }, 2000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    useEffect(() => {
        const preventDefault = (e: Event) => e.preventDefault();
        document.body.style.overflow = 'hidden';
        document.addEventListener('touchmove', preventDefault, { passive: false });
        getRandomBgEmoji()
        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('touchmove', preventDefault);
        };
    }, []);

    const id = app.initDataUnsafe.user?.id

    if (isLoading) {
        return <Loader loading={isLoading} />;
    }

    return (
        <div className={styles.background}>
            {/* Gradient background */}
            <div className={styles.gradientBackground}></div>
            <div className={styles.radialGradientOverlay}>
                <div className="radial-gradient-overlay"></div>
            </div>
    
            {/* Emoji animation layer */}
            <div className={styles.emojiLayer}>
                <div className={styles.emojiContainer}>
                {emogis.map((emoji, index) => (
                        <Emoji key={index} emoji={emoji} speed={speed} />
                    ))}

                </div>
            </div>
    
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <div className="text-center relative">
                        <img
                            src='/images/coinmania.webp'
                            alt="COINMANIA"
                            className={styles.headerImage}
                            width={300}
                        />
                    </div>
                </div>
    
                {/* Score and associated components */}
                <div className={styles.scoreSection}>
                    <div className="text-center">
                        <div className={styles.score}>
                            <img src='/images/coin.png' width={30} alt="Coin" className={styles.scoreImage} />
                            <span className="text-3xl font-bold">{userData.scores.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Rules and prizes */}
                <div className="fixed w-full mx-auto top-20 px-4 z-[100] flex justify-between items-center">
                    <button onClick={handleRulesButtonClick} className="w-16 h-16 flex justify-center items-center rounded-full relative">
                        <div className="rounded-full" style={{position: "absolute",top: 0,left: 0,right: 0,bottom: 0,backgroundColor: "rgba(255, 255, 255, 0.1)",backdropFilter: "blur(10px)",WebkitBackdropFilter: "blur(10px)",boxShadow: "rgba(255, 255, 255, 0.2) 0px 0px 10px, rgba(255, 255, 255, 0.1) 0px 0px 15px inset",zIndex: -1}}></div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                    </button>
                    <button onClick={handlePrizesButtonClick} className="w-16 h-16 flex justify-center items-center rounded-full relative">
                        <div className="rounded-full" style={{position: "absolute",top: 0,left: 0,right: 0,bottom: 0,backgroundColor: "rgba(255, 255, 255, 0.1)",backdropFilter: "blur(10px)",WebkitBackdropFilter: "blur(10px)",boxShadow: "rgba(255, 255, 255, 0.2) 0px 0px 10px, rgba(255, 255, 255, 0.1) 0px 0px 15px inset",zIndex: -1}}></div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gift"><rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path></svg>
                    </button>
                    {openRules && 
                        <Modal onClose={handleCloseRules}>
                            <div className="">
                                <h2 className="text-lg font-semibold leading-none tracking-tight text-center text-yellow-400">Правила игры</h2>
                            </div>
                            {RULES.map((rule, idx) => (
                                <Rule key={idx * 0.8829} text={rule.text} icon={rule.icon} />
                            ))}
                        </Modal>
                    }
                    {openPrizes &&
                        <Modal onClose={handleClosePrizes}>
                            <div className="">
                                <h2 className="text-lg font-semibold leading-none tracking-tight text-center text-yellow-400">Призы</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {PRIZES.map((prize, idx) => (
                                    <Prize key={idx * 0.12829} {...prize} />
                                ))}
                            </div>
                        </Modal>
                    }
                </div>
    
                {/* Main coin */}
                <div className={styles.mainCoin}>
                    <div
                        ref={coinRef}
                        className="relative select-none touch-none"
                        onClick={handleButtonClick}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleMouseUp}
                        style={{
                            userSelect: 'none',
                            pointerEvents: 'none',
                        }}
                    >
                        <img
                            src='/images/notcoin.png'
                            alt="notcoin"
                            draggable="false"
                            width={coinSize} // Замените статическое значение на динамическое
                            style={{
                                pointerEvents: 'auto',
                                userSelect: 'none',
                                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isPressed ? 'scale(0.95)' : 'scale(1)'}`,
                                transition: 'transform 0.1s',
                            }}
                            className={`${styles.coinImage} select-none`}
                        />
    
                        {coinEmojis.length > 0 &&
                            <CoinEmojis
                                emojis={coinEmojis}
                                setCoinEmojis={setCoinEmojis}
                            >
                            </CoinEmojis>
                        }
                        {clicks.map((click) => (
                            <div
                                key={click.id}
                                className={`${styles.clickValue} float-animation`}
                                style={{
                                    top: `${click.y - 42}px`,
                                    left: `${click.x - 28}px`,
                                    pointerEvents: 'none'
                                }}
                                onAnimationEnd={() => handleAnimationEnd(click.id)}
                            >
                                +{click.value}⭐️
                            </div>
                        ))}
    
                    </div>
                </div>
    
                {/* Energy section */}
                <div className={styles.energySection}>
    
                    <div className={styles.energyInfo}>
                        <span className={styles.energyText}>
                            ⚡️{userData.energy} / {userData?.maxenergy ?? 1000}
                        </span>
                    </div>
                        <div className={styles.energyWrap}>
                            <div className={styles.energyBar}>
                                <div
                                    className={styles.energyFill}
                                    style={{width: `${(userData.energy / (userData?.maxenergy ?? 1000)) * 100}%`}}
                                />
                            </div>
                        </div>
                    
                </div>
    
            </div>
            {showLowEnergyPopup[0] && <Popup popup={popupNegative}/>}
        </div>
    );
};

export default CoinMania;
