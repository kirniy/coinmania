import { webAppContext } from "@/app/context"
import { LoadingContext } from '@/app/context/LoaderContext'
import Loader from "@/components/loader/loader"
import { InnerModal } from "@/components/modal/InnerModal"
import { unlockScroll } from '@/helpers/manageScroll'
import { RootState } from "@/store/rootReducer"
import { updateUserReferred, updateUserScores } from "@/store/userSlice"
import { referredUserRecord, UserData } from "@/types/user"
import axios from "axios" 
import { ChevronDown, ChevronUp, Users, XCircle } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { createPortal } from "react-dom"
import { useDispatch, useSelector } from 'react-redux'
import styles from './ProfilePage.module.css'; // Импортируем стили
import { AmountDisplay } from "@/components/common/AmountDisplay"

const ProfilePage = () => {
    document.body.classList.add('!overflow-hidden')
    const {app} = useContext(webAppContext);
    const userData = useSelector((state: RootState) => state.user.data);
    const { isLoading, setLoading } = useContext(LoadingContext);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [isInvitePressed, setIsInvitePressed] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState<Pick<UserData, 'id' | 'first_name' | 'scores'>[]>([]);

    const [showRewardSuccess, setShowRewardSuccess] = useState(false);
    const [showRewardError, setShowRewardError] = useState(false)

    function handleCloseRewardSuccess() {
        setShowRewardSuccess(false)
    }
    function handleCloseRewardError() {
        setShowRewardError(false)
    }

    const dispatch = useDispatch();

    const now = new Date().getTime();
    const created = new Date(userData?.created_at as string).getTime();
    const differenceInMilliseconds = now - created;
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data: {users: UserData[]} = await response.json();

            if (data.users) {
                const sortedUsers = data.users.sort((a: UserData, b: UserData) => (b?.scores ?? 0) - (a?.scores ?? 0));
                setUsers(sortedUsers);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {

        }
    };

    const [showClaimedReferrals, setShowClaimedReferrals] = useState(false);

    const unclaimedReferrals = userData?.referrals.filter(referral => !referral.reward_claimed);
    const claimedReferrals = userData?.referrals.filter(referral => referral.reward_claimed);

    useEffect(() => {
        unlockScroll();
        fetchUsers();
    }, []);

    const referralLink = () => {      
        const referralLink = `${process.env.NEXT_PUBLIC_TG_APP_URL ?? 'https://t.me/vinovnicabot/start'}?startapp=${userData?.id}`;
        const tgLink = `https://t.me/share/url?url=${encodeURI(referralLink)}`;

        return tgLink;
    };


    const buttonStyle = {
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        ':active': {
            transform: 'scale(0.98)',
        }
    };

    type ScoreboardDisplayProps = {
        icon: string,
        iconType?: "img" | "emoji",
        value: number | string,
        color: string,
        fontSize: string,
        width: string,
    }

    const ScoreboardDisplay = ({ icon, iconType = "emoji", value, color, fontSize, width }: ScoreboardDisplayProps) => (
        <div style={{
            fontSize: fontSize,
            fontWeight: 'bold',
            color: color,
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            padding: '5px 10px',
            margin: '5px auto',
            border: `2px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: width,
        }}>
            {iconType === 'img' && <img src={icon} width={28} style={{ marginRight: '5px' }} />}
            {iconType === 'emoji' && icon}
            {value}
        </div>
    );

    const handleGetRewardClick = async (referral: referredUserRecord) => {
        console.log(referral);
        
        try {
            const response = await axios.get(`/api/user/referrals/get_reward?userId=${userData?.id}&referralId=${referral.id}`);

            const data = response.data;
    
            dispatch(updateUserReferred({
                ...referral,
                reward_claimed: true,
            }))
    
            dispatch(updateUserScores(data.scores));
            fetchUsers();

            setShowRewardSuccess(true)
        } catch (error) {
            console.error('Error claiming reward:', error);
            setShowRewardError(true)

        }

    }

    if (isLoading) {
        return <Loader loading={isLoading} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.profileSection}>
                    <h2 className={styles.title}>👤 Мой профиль</h2>
                    <div className={styles.userInfo}>
                        <h3 className={styles.userName}>{app.initDataUnsafe.user?.first_name}</h3>
                        <span className={styles.userTitle}>Участник клуба VNVNC</span>
                    </div>
                    <div
                        style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: '#f8cc46',
                            textAlign: 'center',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '10px',
                            padding: '5px 10px',
                            margin: '5px auto',
                            border: `2px solid #f8cc46`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <AmountDisplay amount={userData?.scores || 0} coinSize={28} />
                    </div>
                    <ScoreboardDisplay icon="⚡️" value={userData?.energy + '/' + userData?.maxenergy } color="#ffffff" fontSize="1.2rem" width="60%" />
                    <h4 className={styles.statsTitle}>📊 Статистика:</h4>
                    <div className={styles.stats}>
                        <div>📅 Количество дней в игре: <span style={{ color: '#f8cc46' }}>{differenceInDays === 0 ? 1 : differenceInDays}</span></div>
                        <div>👥 Приглашено друзей: <span style={{ color: '#f8cc46' }}>{userData?.referrals?.length ?? 0}</span></div>
                    </div>
                    <a
                        href={referralLink()}
                        onMouseDown={() => setIsInvitePressed(true)}
                        onMouseUp={() => setIsInvitePressed(false)}
                        onMouseLeave={() => setIsInvitePressed(false)}
                        style={{
                            ...buttonStyle,
                            width: '100%',
                            padding: '15px',
                            marginTop: '15px',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: isInvitePressed ? '#1a7999' : '#2596be',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isInvitePressed ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)',
                            transform: isInvitePressed ? 'scale(0.98)' : 'scale(1)',
                        }}
                    >
                        <Users size={20} style={{ marginRight: '10px' }} /> Пригласить друзей
                    </a>
                    <p className={`${styles.inviteText}`}>
                        Приглашай друзей и получай по <AmountDisplay amount={2e4} coinSize={10} className="mx-1" />
                        за каждого друга, который зайдет в игру по твоей ссылке!
                    </p>
                </div>

                {userData?.referrals && userData.referrals.length > 0 &&
                    <div className={styles.profileSection}>
                        <h2 className={styles.title}>
                            Приглашённые друзья
                        </h2>

                        <div className="flex flex-col gap-4">
                            {unclaimedReferrals
                                && unclaimedReferrals.length > 0
                                && unclaimedReferrals.map(referral => (
                                    <div
                                        key={referral.id}
                                        className="text-white flex items-center gap-2 p-2 border-white border-opacity-80 border rounded-xl"
                                    >
                                        <span className="text-sm text-ellipsis overflow-hidden max-w-[55%] whitespace-nowrap">
                                            {referral.user.first_name}
                                        </span>
                                        <button
                                            type="button"
                                            className={styles.getRewardButton}
                                            onClick={() => handleGetRewardClick(referral)}
                                        >
                                            <AmountDisplay amount={2e4} coinSize={15} />
                                        </button>
                                    </div>
                            ))}

                            {!unclaimedReferrals
                                || unclaimedReferrals.length === 0
                                && (
                                    <span className="text-white text-[0.8rem]">Ты уже собрал все награды за своих друзей! Пригласи ещё, чтобы получить новые бонусы.</span>
                                )
                            }

                            {/* Кнопка для раскрытия/скрытия списка с полученными наградами */}
                            {claimedReferrals
                                && claimedReferrals.length > 0
                                && (
                                <button
                                    type="button"
                                    className="mt-4 text-white flex gap-2 mx-auto"
                                    onClick={() => setShowClaimedReferrals(!showClaimedReferrals)}
                                >
                                    {showClaimedReferrals ? 'Скрыть полученные награды' : 'Показать полученные награды'}
                                    {showClaimedReferrals ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                )
                            }

                            {/* Список приглашенных, за которых награда уже получена */}
                            {showClaimedReferrals
                                && claimedReferrals
                                && claimedReferrals.length > 0
                                && (
                                <div className="mt-2 flex flex-col gap-4">
                                    {claimedReferrals.map(referral => (
                                        <div
                                            key={referral.id}
                                            className="text-white flex items-center gap-2 p-2 border-white border-opacity-80 border rounded-xl"
                                        >
                                            <span className="text-sm text-ellipsis overflow-hidden max-w-[55%] whitespace-nowrap">
                                                {referral.user.first_name}
                                            </span>
                                            <span
                                                className="py-2 px-4 bg-[#00b600] text-white rounded-[25px] text-[0.8rem] ml-auto"
                                            >
                                                Получено!
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                }

                <button onClick={() => setShowLeaderboard(true)} className={styles.leaderboardButton}>
                    🏆 Лидеры VNVNC
                </button>
            </div>

            {showLeaderboard && (
                <div className={styles.leaderboardPopup}>
                    <div className={styles.leaderboardContent}>
                        <div className={styles.leaderboardHeader}>
                            <h2 className={styles.leaderboardTitle}>🏆 Лидеры VNVNC</h2>
                            <button onClick={() => setShowLeaderboard(false)} className={styles.closeButton}><XCircle size={30} /></button>
                        </div>
                        <div className={styles.leaderboardList}>
                            {users.map((user, index) => {

                                return (
                                <div 
                                    key={index} 
                                    className={styles.leaderboardItem} 
                                    style={{ backgroundColor: index < 3 ? ['gold', 'silver', '#cd7f32'][index] : user.id === userData?.id ? '#772422' : 'rgba(255,255,255,0.1)', color: index < 3 ? '#000000' : '#ffffff', border: user.id === userData?.id ? '2px solid white' : ''}}>
                                    <div className={styles.leaderboardUserInfo}>
                                        <span className={styles.leaderboardUserIndex} style={{ color: index < 3 ? '#96231a' : 'inherit' }}>{index + 1}</span>
                                        <span>{user.first_name}</span>
                                        {index === 0 && <span className={styles.crownIcon}>👑</span>}
                                    </div>
                                    <div className={styles.leaderboardUserScore}>
                                        <div>{user.scores}</div>
                                        <span className="text-yellow-300">⭐</span>
                                    </div>
                                </div>
                            )})}
                        </div>
                        {/* <p className={styles.leaderboardFooterText}>
                            В полной версии отображается топ-30 игроков
                        </p> */}
                    </div>
                </div>
            )}
            {showRewardSuccess && createPortal(
                <InnerModal onClose={handleCloseRewardSuccess} type='confirm' title='Успех!' description="Награда получена" />,
                document.body,
            )}
            {showRewardError && createPortal(
                <InnerModal onClose={handleCloseRewardError} type='confirm' title='Ошибка' description="Не удалось получить награду" />,
                document.body,
            )}
        </div>
    );
};

export default ProfilePage;
