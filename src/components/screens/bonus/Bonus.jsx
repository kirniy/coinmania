import { webAppContext } from "@/app/context"
import axios from 'axios'
import { XCircle } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import styles from './CoinManiaBonusPage.module.css'; // Импортируем стили

import Boosters from './components/Boosters';
import InfoBox from "@/components/common/InfoBox";

const CoinManiaBonusPage = () => {
    const [activeBooster, setActiveBooster] = useState(null);
    const [showTasks, setShowTasks] = useState(false);
    const [taskStatus, setTaskStatus] = useState({});
    const [loadingTasks, setLoadingTasks] = useState({});
    const {app} = useContext(webAppContext);

    const tasks = [
        { platform: 'Telegram', channels: ['Маленькая Виновница', 'VNVNC', 'ANGAR'], reward: 5000, duration: 15, color: '#0088cc' },
        { platform: 'Instagram', channels: ['Маленькая Виновница', 'VNVNC', 'ANGAR'], reward: 10000, duration: 240, color: '#c13584' },
    ];

    const subscribeToChannel = async (platform, channel) => {
        try {
            setLoadingTasks(prev => ({ ...prev, [`${platform}-${channel}`]: true }));
            await axios.post('/api/tasks/update', {
                taskId: `${platform}-${channel}`,
                userId: app.initDataUnsafe.user?.id,
                name: channel,
                platform,
                reward: tasks.find(t => t.platform === platform).reward,
                link: ''
            });
            setTaskStatus(prev => ({
                ...prev,
                [`${platform}-${channel}`]: { status: 'checking', timeLeft: tasks.find(t => t.platform === platform).duration * 60 }
            }));
        } catch (error) {
            console.error("Failed to update task:", error);
            setLoadingTasks(prev => ({ ...prev, [`${platform}-${channel}`]: false }));
        }
    };

    useEffect(() => {
        const fetchTaskStatuses = async () => {
            try {
                const { data } = await axios.get(`/api/tasks/update?userId=${app.initDataUnsafe.user?.id}`);
                const statuses = data.tasks.reduce((acc, task) => {
                    acc[task.id] = task.status;
                    return acc;
                }, {});
                setTaskStatus(statuses);
            } catch (error) {
                console.error("Failed to fetch task statuses:", error);
            }
        };

        fetchTaskStatuses();
    }, [app.initDataUnsafe.user?.id]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (activeBooster) {
                setActiveBooster(prev => {
                    if (prev.timeLeft > 0) {
                        return { ...prev, timeLeft: prev.timeLeft - 1 };
                    } else {
                        return null;
                    }
                });
            }

            setTaskStatus(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(key => {
                    if (updated[key].status === 'checking') {
                        if (updated[key].timeLeft > 0) updated[key].timeLeft -= 1;
                        else updated[key].status = 'completed';
                    }
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [activeBooster]);

    const buttonStyle = {
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        ':active': {
            transform: 'scale(0.98)',
        }
    };

    const boosterStyle = (booster) => ({
        ...buttonStyle,
        width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '20px',
        fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer',
        background: activeBooster && activeBooster.multiplier === booster.multiplier
            ? `linear-gradient(145deg, ${booster.color}, ${booster.color}aa)`
            : `linear-gradient(145deg, ${booster.color}aa, ${booster.color}55)`,
        color: '#ffffff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    });

    const taskButtonStyle = (task, status, isMain = false) => ({
        ...buttonStyle,
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '15px',
        fontSize: isMain ? '1.1rem' : '1rem',
        fontWeight: 'bold',
        border: 'none',
        cursor: status === 'completed' ? 'default' : 'pointer',
        background:
            status === 'completed' ? '#4a4a4a' :
                status === 'checking' ? `linear-gradient(145deg, ${task.color}dd, ${task.color})` :
                    `linear-gradient(145deg, ${task.color}, ${task.color}dd)`,
        color: '#f0f0f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        gridColumn: isMain ? 'span 2' : 'span 1',
    });

    const infoBoxStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderLeft: '4px solid #f8cc46',
        padding: '15px',
        marginBottom: '25px',
        borderRadius: '0 10px 10px 0',
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.bonusSection}>

                    <div className="flex flex-col gap-4">
                        <h2 className={styles.title}>🚀 Бустеры</h2>
                        <Boosters>
                        </Boosters>

                        <InfoBox>
                            Каждый бустер можно использовать только 3 раза в день, после истечения 24-х часов их можно будет использовать снова.
                        </InfoBox>
                    </div>
                </div>

                <button onClick={() => setShowTasks(true)} className={styles.tasksButton}>
                    ✅ Задания
                </button>
            </div>

            {/* Tasks Pop-up */}
            {showTasks && (
                <div className={styles.tasksPopup}>
                    <div className={styles.tasksPopupContent}>
                        <div className={styles.tasksPopupHeader}>
                            <h2 className={styles.tasksPopupTitle}>✅ Задания</h2>
                            <button onClick={() => setShowTasks(false)} className={styles.closeButton}><XCircle size={30} /></button>
                        </div>
                        <div style={infoBoxStyle}>
                            <p style={{fontSize: '0.9rem', lineHeight: '1.4'}}>Для проверки подписки на каждый аккаунт мы проведем проверку. Для Telegram это займет 15 минут. Для Instagram может потребоваться до 24 часов. Вернитесь в этот раздел позже, чтобы проверить прогресс верификации. В случае успеха вы получите награды на баланс Coinmania.</p>
                        </div>
                        {tasks.map((task) => (
                            <div key={task.platform} style={{marginBottom: '25px'}}>
                                <h3 className={styles.tasksPopupPlatform}>{task.platform}</h3>
                                <div className={styles.taskButtonGrid}>
                                    {task.channels.map((channel, index) => {
                                        const status = taskStatus[`${task.platform}-${channel}`]?.status || 'pending';
                                        const timeLeft = taskStatus[`${task.platform}-${channel}`]?.timeLeft || 0;
                                        const minutes = Math.floor(timeLeft / 60);
                                        const seconds = timeLeft % 60;
                                        const isMain = index === 0;
                                        return (
                                            <button key={channel} onClick={() => subscribeToChannel(task.platform, channel)} style={taskButtonStyle(task, status, isMain)} disabled={status === 'completed' || status === 'checking'}>
                                                {status === 'completed' ? `✅ ${task.reward / 1000}K⭐️` : status === 'checking' ? `${minutes}:${seconds.toString().padStart(2, '0')}` : (
                                                    <>
                                                        {channel}
                                                        <br />
                                                        <span style={{fontSize: '0.8em'}}>{task.reward / 1000}K⭐️</span>
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoinManiaBonusPage;
