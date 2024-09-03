import React, { useState } from "react";
import { upgrade, upgradeLevel, UPGRADES, upgradeType } from "@/constants/upgrades";
import styles from './Upgrades.module.css';

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { updateUserMaxEnergy, updateUserScores, updateUserUpgrades } from "@/store/userSlice";
import { createPortal } from "react-dom";
import { InnerModal } from "@/components/modal/InnerModal";

export const Upgrades: React.FC = () => {

    const userData = useSelector((state: RootState) => state.user.data);
    const dispatch = useDispatch();

    const [showUpgradeError, setShowUpgradeError] = useState([false, null] as [boolean, null | string]);

    function handleCloseBoosterError() {
        setShowUpgradeError([false, null])
    }

    const handleBuyUpgradeClick = async (type: upgradeType, upgradeLevel: upgradeLevel) => {
        try {
            const response = await fetch(`/api/util/buy_upgrade?userId=${userData?.id}&type=${type}&level=${upgradeLevel.level}`)
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error)
            }
    
            if (result?.result && userData) {
                dispatch(updateUserUpgrades(
                    {
                        ...userData.upgrades,
                        [type]: upgradeLevel.level,
                    }
                ));
                dispatch(updateUserScores(result.scores));
                if (result?.maxEnergy) {
                    dispatch(updateUserMaxEnergy(result.maxEnergy))
                }
            }
        } catch (error: any) {
            setShowUpgradeError([true, error.message] as [boolean, string])
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col gap-4 text-white">
            {UPGRADES.map(upgrade => {
                const currentLevel = userData?.upgrades[upgrade.type] ?? 1;
                const availableLevel = Math.min(currentLevel + 1, upgrade.maxLevel);

                return (
                    <div key={upgrade.name} className="w-full">
                        <h2 className="text-title text-large">{upgrade.name}</h2>
                        <div className="flex flex-col gap-2">
                            Текущий уровень: {currentLevel} / {upgrade.maxLevel}
                            {upgrade.levels
                                .filter(upgradeLevel => upgradeLevel.level === availableLevel)
                                .map(upgradeLevel => {
                                    return (
                                        <div className="flex gap-2 items-center w-full" key={upgradeLevel.level}>
                                            {currentLevel < upgrade.maxLevel &&
                                                <div className="flex items-center justify-between gap-2">
                                                    <span>Купить {availableLevel}-й уровень</span>

                                                    <button
                                                        className={styles.buyUpgradeButton}
                                                        onClick={() => {handleBuyUpgradeClick(upgrade.type, upgradeLevel)}}
                                                    >
                                                        {upgradeLevel.cost.toLocaleString()}
                                                        <img src='/images/coin.png' width={15} alt="Coin" className='ml-1' />
                                                    </button>
                                                </div>
                                            }

                                            {currentLevel === upgrade.maxLevel &&
                                                <div>
                                                    <span>Достигнут максимальный уровень!</span>
                                                </div>
                                            }

                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                )
            })}
            {showUpgradeError[0] && createPortal(
                <InnerModal onClose={handleCloseBoosterError} type='confirm' title='Ошибка покупки улучшения' description={showUpgradeError[1]} />,
                document.body,
            )}
        </div>
    );
}