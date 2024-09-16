import { upgradeLevel, UPGRADES, upgradeType } from "@/constants/upgrades"
import React, { useState } from "react"

import { InnerModal } from "@/components/modal/InnerModal"
import { RootState } from "@/store/rootReducer"
import { updateUserMaxEnergy, updateUserScores, updateUserUpgrades } from "@/store/userSlice"
import { createPortal } from "react-dom"
import { useDispatch, useSelector } from "react-redux"
import UpgradeItem from './UpgradeItem'

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
                const nextLevelType = upgrade.levels.filter(upgradeLevel => upgradeLevel.level === availableLevel)
                const currentLevelType = upgrade.levels.filter(upgradeLevel => upgradeLevel.level === currentLevel)

                return (
                    <UpgradeItem
                        key={upgrade.name}
                        title={upgrade.name}
                        level={currentLevel}
                        maxLevel={upgrade.maxLevel}
                        icon={upgrade.icon}
                        cost={nextLevelType[0].cost}
                        effect={currentLevelType[0].effect}
                        onClick={() => {handleBuyUpgradeClick(upgrade.type, nextLevelType[0])}}
                        isMax={currentLevel === upgrade.maxLevel}
                    />
                )
            })}
            {showUpgradeError[0] && createPortal(
                <InnerModal onClose={handleCloseBoosterError} type='confirm' title='Ошибка покупки улучшения' description={showUpgradeError[1]} />,
                document.body,
            )}
        </div>
    );
}