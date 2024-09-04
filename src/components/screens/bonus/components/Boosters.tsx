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
import { showPopup } from '@/utils/showPopup';
import { createPortal } from 'react-dom';
import { InnerModal } from '@/components/modal/InnerModal';

const Boosters: React.FC = ({}) => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.data);
    const [showPopupEnergy, setShowPopupEnergy] = React.useState([false, null] as [boolean, null | NodeJS.Timeout]);
    const [showPopupBooster, setShowPopupBooster] = React.useState([false, null] as [boolean, null | NodeJS.Timeout]);
    const [showPositivePopup, setShowPositivePopup] = React.useState([false, null] as [boolean, null | NodeJS.Timeout]);
    const [showNegativePopup, setShowNegativePopup] = React.useState([false, null] as [boolean, null | NodeJS.Timeout]);
    const [showErrorEnergyModal, setShowErrorEnergyModal] = React.useState([false, null] as [boolean, null | string]);
    const popupEnegry: PopupProps = {
        pic: "attention",
        text: "У вас достаточно энергии",
        setState: setShowPopupEnergy,
    }
    const popupBooster: PopupProps = {
        pic: "attention",
        text: "Бустер сейчас активен",
        setState: setShowPopupBooster,
    }
    const popupPositive: PopupProps = {
        pic: "info",
        text: "Бустер применён",
        setState: setShowPositivePopup,
    }
    const popupNegative: PopupProps = {
        pic: "error",
        text: "Бустер закончился",
        setState: setShowNegativePopup,
    }

    function hideAllPopups() {
        setShowPopupEnergy([false, null]);
        setShowPopupBooster([false, null]);
        setShowPositivePopup([false, null]);
        setShowNegativePopup([false, null]);
    }

    function handleCloseEnergyModal() {
        setShowErrorEnergyModal([false, null]);
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
            setShowErrorEnergyModal([true, error] as [boolean, string]);
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
        hideAllPopups();
        switch (booster.action) {
            case 'resetEnergy':
                const energyBoostsRemainig = userData?.daily_full_tank_count;
                if(userData?.energy && userData.energy > 100 && energyBoostsRemainig !== 0) {
                    setShowPopupEnergy([true, null])
                }  else if (energyBoostsRemainig === 0) {
                    setShowNegativePopup([true, null])
                } else {
                    setShowPositivePopup([true, null])
                    resetEnergy(booster);
                }
                break;
            case 'tapBoost':
                const tapBoostRemainingTime = userData?.tap_boost_remaining_time;
                const isBoosterActive = tapBoostRemainingTime && (tapBoostRemainingTime > 0);
                const tapBoostsRemainig = userData?.daily_tap_boost_count;
                
                if (isBoosterActive) {
                    setShowPopupBooster([true, null])
                } else if (tapBoostsRemainig === 0) {
                    setShowNegativePopup([true, null])
                } else {
                    setShowPositivePopup([true, null])
                    activateBooster(booster);    
                }
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
                        >
                            {booster.name} ({(userData && userData[`daily_${booster.slug}_count`]) ?? booster.maxUsePerDay} / {booster.maxUsePerDay})
                        </button>
                    </div>
                )
            })}
            {showPopupEnergy[0] && createPortal(
                <Popup popup={popupEnegry}/>,
                document.body
            )}
            {showPopupBooster[0] && createPortal(
                <Popup popup={popupBooster}/>,
                document.body
            )}
            {showPositivePopup[0] && createPortal(
                <Popup popup={popupPositive}/>,
                document.body
            )}
            {showNegativePopup[0] && createPortal(
                <Popup popup={popupNegative}/>,
                document.body
            )}
            {showErrorEnergyModal[0] && createPortal(
                <InnerModal onClose={handleCloseEnergyModal} type='confirm' title='Произошла ошибка при сбросе энергии' description={showErrorEnergyModal[1]} />,
                document.body,
            )}
        </div>
    )
}

export default Boosters;
