import { BOOSTERS } from '@/constants/earn';
import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { updateUserEnergy } from '@/store/userSlice';
import { RootState } from '@/store/rootReducer'
import styles from './Boosters.module.css';
import { startCountdown } from '@/store/userSlice';

import {
    updateUserTapBoosterCount,
    updateUserTapBoosterLastTime,
    updateUserFullTankCount,
    updateUserFullTankLastTime,
    updateUserTapBoostRemainingTime,
} from "@/store/userSlice";
import { Booster } from '@/types/boosters';
import { Popup } from '@/components/popup/Popup';
import { PopupProps } from '@/types/popup';

const Boosters: React.FC = ({}) => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.data);
    const [showPopupEnergy, setShowPopupEnergy] = React.useState(false);
    const [showPopupBooster, setShowPopupBooster] = React.useState(false);
    const [showPositivePopup, setShowPositivePopup] = React.useState(false);
    const popupEnegry: PopupProps = {
        pic: "attention",
        text: "У вас достаточно энергии",
    }
    const popupBooster: PopupProps = {
        pic: "attention",
        text: "Бустер сейчас активен",
    }
    const popupPositive: PopupProps = {
        pic: "info",
        text: "Бустер применён",
    }

    const dynamicStyles = (booster: Booster, isAvailable: Boolean = true) => ({
        background: isAvailable
            ? `linear-gradient(145deg, ${booster.bgColor}, ${booster.bgColor}aa)`
            : `linear-gradient(145deg, ${booster.bgColor}aa, ${booster.bgColor}55)`,
    });

    const resetEnergy = async (booster : Booster) => {
        try {
            const response = await axios.get(`/api/util/buy_booster?userid=${userData?.id}&slug=${booster.slug}`);

            const data = response.data;
            console.log("Booster check response:", data);

            if (data.isLimitReached) {
                dispatch(updateUserFullTankCount(0));
                return;
            }

            dispatch(updateUserFullTankCount(data.newAvailableBoostCount));
            dispatch(updateUserFullTankLastTime(data.endTime));

            console.log(`Setting energy to ${data.data}`);
            dispatch(updateUserEnergy(data.data))
        } catch (error) {
            alert("Произошла ошибка при сбросе энергии");
            console.error('Failed to buy booster:', error)
        }
    };

    const activateBooster = async (booster : Booster) => {
        try {
            // Fetch boost restrictions
            const response = await axios.get(`/api/util/buy_booster?userid=${userData?.id}&slug=${booster.slug}`);

            const data = response.data;
            console.log("Booster check response:", data);

            if (data.isLimitReached) {
                dispatch(updateUserTapBoosterCount(0));
                return;
            }

            dispatch(updateUserTapBoosterCount(data.newAvailableBoostCount));
            dispatch(updateUserTapBoosterLastTime(data.endTime));
            dispatch(updateUserTapBoostRemainingTime(data.remainingTime));
            dispatch(startCountdown());

        } catch (error) {
            console.error('Failed to buy booster:', error)
        }
    };

    const handleBoosterClick = (booster: Booster, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        switch (booster.action) {
            case 'resetEnergy':
                if(userData?.energy && userData.energy > 10) {
                    e.currentTarget.disabled = true;
                    setShowPopupEnergy(true);
                    setTimeout(() => setShowPopupEnergy(false), 2000);
                    break;
                } else {
                    e.currentTarget.disabled = false;
                    setShowPositivePopup(true);
                    setTimeout(() => setShowPositivePopup(false), 2000);
                    resetEnergy(booster);
                }
                break;
            case 'tapBoost':
                const tapBoostRemainingTime = userData?.tap_boost_remaining_time;
                const isBoosterActive = tapBoostRemainingTime && (tapBoostRemainingTime > 0);
                if (isBoosterActive) {
                    setShowPopupBooster(true);
                    setTimeout(() => setShowPopupBooster(false), 2000);
                    break;
                } else {
                    setShowPositivePopup(true);
                    setTimeout(() => setShowPositivePopup(false), 2000);
                }
                activateBooster(booster);
                break;
            default:
                break;
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {BOOSTERS.map(booster => {
                const isAvailable = ((userData && userData[`daily_${booster.slug}_count`]) ?? booster.maxUsePerDay) > 0;
                return (
                    <div className="flex flex-col gap-1" key={booster.name}>
                        <span className="text-white">
                            {booster.description}
                        </span>
                        <button
                            key={booster.name}
                            onClick={(e) => {handleBoosterClick(booster, e)}}
                            className={styles.button}
                            style={dynamicStyles(booster, isAvailable)}
                            disabled={!isAvailable}
                        >
                            {booster.name} ({(userData && userData[`daily_${booster.slug}_count`]) ?? booster.maxUsePerDay} / {booster.maxUsePerDay})
                        </button>
                    </div>
                )
            })}
            {showPopupEnergy && (
                <Popup popup={popupEnegry}/>
            )}
            {showPopupBooster && (
                <Popup popup={popupBooster}/>
            )}
            {showPositivePopup && (
                <Popup popup={popupPositive}/>
            )}
        </div>
    )
}

export default Boosters;
