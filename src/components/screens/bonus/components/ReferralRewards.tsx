import styles from '../CoinManiaBonusPage.module.css';
import { REFERRAL_TASKS } from '@/constants/earn';
import GetRewardButton from '@/components/common/GetRewardButton';
import InfoBox from '@/components/common/InfoBox';
import { XCircle } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { updateUserReferralReward, updateUserScores } from '@/store/userSlice';
import { userReferralReward } from '@/types/referralReward';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { InnerModal } from '@/components/modal/InnerModal';
import { ProgressBar } from '@/components/common/ProgressBar';
import { getFormattedNumber } from '@/utils/getFormattedNumber';

type ReferralRewardsProps = {
    setShowRewards: (state: boolean) => void,
}

const ReferralRewards: React.FC<ReferralRewardsProps> = ({ setShowRewards }) => {

    const dispatch = useDispatch();

    const userData = useSelector((state: RootState) => state.user.data);
    const userReferralsCount = userData?.referrals.length || 0;
    const [showSuccessAlert, setShowSuccessAlert] = useState<[boolean, null | string]>([false, null]);
    const [showErrorAlert, setShowErrorAlert] = useState<[boolean, null | string]>([false, null]);

    const handleClaimReward = async (level: userReferralReward['reward_level']) => {
        try {
            const response = await fetch(`/api/util/get_referral_reward`, {
                method: 'POST',
                body: JSON.stringify({
                    id: userData?.id,
                    level: level,
                })
            })

            const result = await response.json();

            if (result.ok && userData) {
                dispatch(updateUserReferralReward(
                    [
                        ...userData.referral_rewards,
                        {
                            reward_level: level,
                            claimed: true,
                        }
                    ]
                ));
                dispatch(updateUserScores(result.scores));

                setShowSuccessAlert([true, 'Награда успешно получена!'])
            } else {
                if (result.error) {
                    setShowErrorAlert([true, result.error])
                }
            }
        } catch (error) {
            console.error('Error claiming reward:', error);
            setShowErrorAlert([true, 'Не удалось получить награду'])
        }
      };

    return (
        <div className={styles.tasksPopup}>
            <div className={styles.tasksPopupContent}>
                <div className={styles.tasksPopupHeader}>
                    <h2 className={styles.tasksPopupTitle}>🎁 Награды</h2>
                    <button onClick={() => setShowRewards(false)} className={styles.closeButton}><XCircle size={30} /></button>
                </div>
                <InfoBox>
                    Вы получите награды за количество приглашённых друзей, если они зайдут в игру хотя бы один раз.
                </InfoBox>

                <div className='flex flex-col gap-4'>
                    {REFERRAL_TASKS.map((task) => {
                        const claimed = userData?.referral_rewards.some((reward) => reward.reward_level === task.goal && reward.claimed);
                        
                        return (
                            <div key={task.goal} className='text-white flex flex-col gap-1 p-2 border-white border-opacity-80 border rounded-xl relative overflow-hidden'>
                                <span className='flex gap-4 justify-between flex-wrap'>
                                    <span>
                                        { getFormattedNumber(task.reward).toLocaleString() }
                                        <span className="inline-flex items-center">
                                            <img src='/images/coin.png' width={10} alt="Coin" className="mx-1 inline" />
                                        </span>
                                    </span>

                                    <span>
                                        {`${userReferralsCount} / ${task.goal}`}
                                    </span>
                                </span>
                                {claimed ? (
                                <GetRewardButton isReceived={true}>
                                    Получено
                                </GetRewardButton>
                                ) : userReferralsCount >= task.goal ? (
                                    <GetRewardButton onClick={() => handleClaimReward(task.goal)}>Получить</GetRewardButton>
                                ) : (
                                    <ProgressBar
                                        progress={Math.min((userReferralsCount)/task.goal * 100, 100)}
                                    />
                                )}
                            </div>
                        );
                    })}
                    </div>

            </div>

            {showSuccessAlert[0] && createPortal(
                <InnerModal
                    type='confirm'
                    title='Успех!'
                    onClose={() => {setShowSuccessAlert([false, null])}}
                    description={showSuccessAlert[1]}
                    confirmMessage='Отлично!'
                >
                </InnerModal>,
                document.body
            )}

            {showErrorAlert[0] && createPortal(
                <InnerModal
                    type='confirm'
                    title='Награда не получена'
                    onClose={() => {setShowErrorAlert([false, null])}}
                    description={showErrorAlert[1]}
                >
                </InnerModal>,
                document.body
            )}
        </div>
    )
}

export { ReferralRewards }