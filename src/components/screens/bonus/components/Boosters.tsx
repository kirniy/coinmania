import { BOOSTERS } from '@/constants/earn';
import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserEnergy } from '@/store/userSlice';
import { RootState } from '@/store/rootReducer'
import styles from './Boosters.module.css';

import {
    updateUserTapBoosterCount,
    updateUserTapBoosterLastTime,
    updateUserFullTankCount,
    updateUserFullTankLastTime
} from "@/store/userSlice";
import { Booster } from '@/types/boosters';

const Boosters: React.FC = ({}) => {
    const dispatch = useDispatch();
    const userData = useSelector((state: RootState) => state.user.data);

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
        } catch (error) {
            console.error('Failed to buy booster:', error)
        }
    };

    const handleBoosterClick = (booster: Booster) => {
        switch (booster.action) {
            case 'resetEnergy':
                resetEnergy(booster);
                break;
            case 'tapBoost':
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
                            onClick={() => {handleBoosterClick(booster)}}
                            className={styles.button}
                            style={dynamicStyles(booster, isAvailable)}
                            disabled={!isAvailable}
                        >
                            {booster.name} ({(userData && userData[`daily_${booster.slug}_count`]) ?? booster.maxUsePerDay} / {booster.maxUsePerDay})
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default Boosters;
