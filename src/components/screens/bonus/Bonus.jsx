import { XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import styles from './CoinManiaBonusPage.module.css'; // Импортируем стили

import InfoBox from "@/components/common/InfoBox"
import { InnerModal } from '@/components/modal/InnerModal'
import { Modal } from '@/components/modal/Modal'
import { updateUserScores } from "@/store/userSlice"
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from "react-redux"
import Boosters from './components/Boosters'
import { Upgrades } from "./components/Upgrades"

// STYLES

const buttonStyle = {
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    ':active': {
        transform: 'scale(0.98)',
    }
};
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
    background: status === 'completed' ? '#4a4a4a' : status === 'checking' ? `linear-gradient(145deg, ${task.color}dd, ${task.color})` : `linear-gradient(145deg, ${task.color}, ${task.color}dd)`,
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

// END STYLES

const handleButtonClick = async (setShowTasksModal) => {
    setShowTasksModal(true);
};

function Task({task, index, isBoost = false}) {
    const userData = useSelector((state) => state.user.data);
    const userId = userData.id;
    const dispatch = useDispatch();

    const [showTasksModal, setShowTasksModal] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState([false, null]);
    const [showAlertSubscrNotFound, setShowAlertSubscrNotFound] = useState([false, null]);
    const [showErrorAlert, setShowErrorAlert] = useState([false, null]);

    const isMain = index === 0 || index === 3;
    const status = 'pending';

    function handleCloseAlert() {
        setShowSuccessAlert(false);
        setShowAlertSubscrNotFound(false);
        setShowErrorAlert([false, null]);
    }
    function handleModalClose() {
        setShowTasksModal(false);
    }

    async function handleVerifyButtonClick(task_id) {
        try {
            const req = await fetch(`/api/get_chat_member?id=${userId}&task_id=${task_id}`);
            const res = await req.json();
            if (res.ok) {
                setShowTasksModal(false);
                setShowSuccessAlert([true, 'Подписка проверена']);
                dispatch(updateUserScores(res.scores))
            } else {
                if(res.error) setShowErrorAlert([true, res.error])
                else setShowAlertSubscrNotFound([true, 'Подписка не найдена']);
            }
        } catch (error) {
            setShowErrorAlert([true, error])
        }
    }

    async function handleVerifyBoostButtonClick(task_id) {
        try {
            const req = await fetch(`/api/get_chat_boost?id=${userId}&task_id=${task_id}`);
            const res = await req.json();

            if (res.ok) {
                setShowTasksModal(false);
                setShowSuccessAlert([true, 'Буст канала проверен']);
                dispatch(updateUserScores(res.scores))
            } else {
                if(res.error) setShowErrorAlert([true, res.error])
                else setShowAlertSubscrNotFound([true, 'Проверьте свои бусты, не все условия выполнены']);
            }
        } catch (error) {
            setShowErrorAlert([true, error])
        }
    }

    return (
        <React.Fragment> 
            <button 
                onClick={() => handleButtonClick(setShowTasksModal)} 
                style={taskButtonStyle(task, status, isMain)} 
                disabled={status === 'completed' || status === 'checking'}
            >
                {status === 'completed' ? `✅ ${task.reward / 1000}K⭐️` : (
                    <>
                        {task.name}
                        <br />
                        <span style={{fontSize: '0.8em'}}>{task.reward / 1000}K⭐️</span>
                    </>
                )}
            </button>
            {showTasksModal && 
            createPortal(
                <Modal onClose={handleModalClose}>
                    <h3 className="text-yellow-500 text-xl font-bold mb-3">{task.platform}</h3>
                    <p className="text-white mb-4">{task.name}</p>
                    <a href={task.link} className="w-full bg-yellow-500 text-center text-gray-900 py-2 rounded-lg font-semibold">{isBoost ? 'Забустить' : 'Подписаться'}</a>
                    {isBoost ? (
                        <button onClick={() => handleVerifyBoostButtonClick(task.id)} className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold">Проверить</button>
                    ) : (
                        <button onClick={() => handleVerifyButtonClick(task.id)} className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold">Проверить</button>
                    )}
                </Modal>,
                document.body
            )}
            {showSuccessAlert[0] && createPortal(
                <InnerModal type='confirm' onClose={handleCloseAlert} title='Успех!' description={showSuccessAlert[1]} confirmMessage='Получить награду'/>,
                document.body
            )}
            {showAlertSubscrNotFound[0] && createPortal(
                <InnerModal type='confirm' onClose={handleCloseAlert} title='Ошибка' description={showAlertSubscrNotFound[1]} confirmMessage='Закрыть'/>,
                document.body
            )}
            {showErrorAlert[0] && createPortal(
                <InnerModal type='confirm' onClose={handleCloseAlert} title='Ошибка' description={showErrorAlert[1]} confirmMessage='Закрыть'/>,
                document.body
            )}
        </React.Fragment>
    );
}

const CoinManiaBonusPage = () => {
    const [showTasks, setShowTasks] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function fetchTasks() {
            const req = await fetch('/api/tasks/get', { cache: 'no-store' });
            const res = await req.json();
            setTasks(res.data);
        }

        fetchTasks();
    }, []);

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

                <div className={styles.bonusSection}>

                    <div className="flex flex-col gap-4">
                        <h2 className={styles.title}>🚀 Улучшения</h2>
                        <Upgrades>
                        </Upgrades>

                        <InfoBox>
                            Улучшения можно купить за коины и они будут действовать постоянно.
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
                        {tasks.find(task => task.platform === "Подписки Telegram") && (
                            <div style={{marginBottom: '25px'}}>
                                <h3 className={styles.tasksPopupPlatform}>Подписки Telegram</h3>
                                <div className={styles.taskButtonGrid}>
                                    {tasks.map((task, idx) => task.platform === "Подписки Telegram" &&  (
                                        <Task task={task} key={task.platform + idx} index={idx}/>
                                    ))}
                                </div>
                            </div>
                        )}
                        {tasks.find(task => task.platform === "Подписки Instagram") && (
                            <div style={{marginBottom: '25px'}}>
                                <h3 className={styles.tasksPopupPlatform}>Подписки Instagram</h3>
                                <div className={styles.taskButtonGrid}>
                                    {tasks.map((task, idx) => task.platform === "Подписки Instagram" && (
                                        <Task task={task} key={task.platform + (idx * 3.1415)} index={idx}/>
                                    ))}
                                </div>
                            </div>
                        )}
                        {tasks.find(task => task.platform === "Буст Telegram Каналов") && (
                            <div style={{marginBottom: '25px'}}>
                                <h3 className={styles.tasksPopupPlatform}>Буст Telegram Каналов</h3>
                                <div className={styles.taskButtonGrid}>
                                    {tasks.map((task, idx) => task.platform === "Буст Telegram Каналов" && (
                                        <Task task={task} key={task.platform + (idx * 1.1514)} index={idx} isBoost='true'/>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoinManiaBonusPage;
