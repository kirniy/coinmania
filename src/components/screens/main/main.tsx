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

    const [isPressed, setIsPressed] = useState(false);
    const [coinEmojis, setCoinEmojis] = useState<EmojiType[]>([]);
    const [clicks, setClicks] = useState<ClickType[]>([]);
    const [lastTapTime, setLastTapTime] = useState(Date.now());
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const headerAnimationSpeedRef = useRef(0.4);
    const lastUpdateTimeRef = useRef(Date.now());
    const coinRef = useRef<HTMLDivElement>(null);
    const consecutiveTapsRef = useRef(0);
    
    const [emogis, setEmogis] = useState<string[]>([])
    const [speed, setSpeed] = useState(1);
    const handleButtonClickSpeed = () => {
        setSpeed((prevSpeed) => (prevSpeed >= 5 ? 1 : prevSpeed + 1)); // Ограничиваем скорость до 5
      };

    const [coinSize, setCoinSize] = useState(360); // Добавляем состояние для размера монеты

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

    const handleButtonClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
        if (userData.energy <= 0) return;

        // Проверяем время действия бустера
        const now = new Date();
        let boosterMultiplier = 1;

        if (userData) {
            const boosterEndTime = new Date(userData.last_tap_boost_time);
            
            if (now < boosterEndTime) {
                boosterMultiplier = 5;
            }
        }

        const pointsToAdd = 1 * boosterMultiplier; // Значение с учетом бустера

        dispatch(updateUserScores(userData.scores + pointsToAdd));
        dispatch(updateUserEnergy(Math.min(userData.energy - 1, userData?.maxenergy ?? 0)));// Уменьшаем энергию, не превышая maxenergy

        const rect = coinRef.current?.getBoundingClientRect();
        if (rect) {
            let clientX, clientY;
            if ('touches' in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            addCoinEmojis(x, y);
            setClicks(prev => [...prev, { id: Date.now(), x, y, value: pointsToAdd }]); // Добавляем значение
        }

        try {
            const { error } = await supabase
                .from('users')
                .update({ scores: userData.scores + pointsToAdd, energy: userData.energy - 1 })
                .eq('id', app.initDataUnsafe.user?.id);

            if (error) {
                throw error;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
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
        if (currentTime - lastTapTime > 1000) {
            consecutiveTapsRef.current = 0;
        }
        consecutiveTapsRef.current++;

        if (consecutiveTapsRef.current >= 8 && consecutiveTapsRef.current % 8 === 0) {
            const newEmojis = Array(12).fill(null).map(() => ({
                id: Date.now() + Math.random(),
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
        setLastTapTime(currentTime);
    }, [lastTapTime]);

    useEffect(() => {
        const animationFrame = requestAnimationFrame(function animate() {
            const currentTime = Date.now();
            const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000; // time in seconds
            lastUpdateTimeRef.current = currentTime;

            const timeSinceLastTap = currentTime - lastTapTime;
            headerAnimationSpeedRef.current = timeSinceLastTap > 2000 ? 0.2 : 1;

            setCoinEmojis(prevEmojis =>
                prevEmojis
                    .map(emoji => ({
                        ...emoji,
                        x: emoji.x + emoji.speedX * deltaTime,
                        y: emoji.y + emoji.speedY * deltaTime + (0.5 * 500 * deltaTime * deltaTime),
                        speedY: emoji.speedY + 500 * deltaTime,
                        opacity: 1 - (currentTime - emoji.createdAt) / 2000 // Добавляем свойство opacity
                    }))
                    .filter(emoji => (currentTime - emoji.createdAt) < 2000 && emoji.y < window.innerHeight && emoji.y > -50) // Удаляем устаревшие эмодзи
            );

            requestAnimationFrame(animate);
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [lastTapTime]);

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
                        onTouchEnd={handleMouseUp}
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
        </div>
    );
};

export default CoinMania;
