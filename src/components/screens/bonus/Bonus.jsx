import { Check, ChevronRight, Coins, Instagram, Rocket, RocketIcon, Send, SquarePlus, Trophy, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import styles from './CoinManiaBonusPage.module.css'; // Импортируем стили

import { InnerModal } from '@/components/modal/InnerModal'
import { Modal } from '@/components/modal/Modal'
import { lockScroll } from '@/helpers/manageScroll'
import { updateUserCompletedTasks, updateUserScores } from "@/store/userSlice"
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from "react-redux"
import ActionButton from './components/ActionButton'
import Boosters from './components/Boosters'
import InstagramTask from './components/InstagramTask'
import { ReferralRewards } from './components/ReferralRewards'
import { Upgrades } from './components/Upgrades'
import { AmountDisplay } from '@/components/common/AmountDisplay';

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

function Task({task, index, isBoost = false, isCompleted = false}) {
    const userData = useSelector((state) => state.user.data);
    const userId = userData.id;
    const dispatch = useDispatch();

    const [showTasksModal, setShowTasksModal] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState([false, null]);
    const [showAlertSubscrNotFound, setShowAlertSubscrNotFound] = useState([false, null]);
    const [showErrorAlert, setShowErrorAlert] = useState([false, null]);
    const [status, setStatus] = useState('pending');

    const isMain = index === 0 || index === 3;

    useEffect(() => {
        if (isCompleted) {
            setStatus('completed')
        }
    }, [])

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
                setStatus('completed');
                dispatch(updateUserCompletedTasks([task_id]))
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
                setStatus('completed');
                dispatch(updateUserCompletedTasks([task_id]))
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
                className="bg-gradient-to-r from-gray-700 to-gray-600 text-white p-2 rounded-lg shadow-lg text-left w-full mb-2 flex items-center justify-between transition-all hover:from-gray-600 hover:to-gray-500"
                onClick={() => handleButtonClick(setShowTasksModal)}
                disabled={status === 'completed' || status === 'checking'}
                style={status === 'completed' || status === 'checking' ? {opacity: 0.5} : {}}
            >
                <span className="text-sm font-bold truncate mr-2">{task.name}</span>
                {status === 'completed' ? (
                    <div className="flex items-center bg-yellow-400 text-black px-2 py-1 rounded-full">
                        <span className="text-xs font-bold">Завершено</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-1 rounded-full">
                        <div className="flex items-center text-xs font-bold">
                            <AmountDisplay amount={task.reward} coinSize={12} />
                        </div>
                    </div>
                )}
            </button> 
            {showTasksModal && 
            createPortal(
                <Modal onClose={handleModalClose}>
                    <div className="flex items-center mb-4">
                        <h3 className="text-white text-xl font-bold">{task.name}</h3>
                    </div>
                    <p className="text-white text-sm mb-4 flex gap-2">Награда: <AmountDisplay amount={task.reward} coinSize={15} /></p>
                    <ActionButton icon={Rocket} label={isBoost ? 'Забустить' : 'Подписаться'} primary large isLink={true} link={task.link} />
                    
                    {isBoost ? (
                        <ActionButton icon={Check} label="Проверить" onClick={() => handleVerifyBoostButtonClick(task.id)} large />
                    ) : (
                        <ActionButton icon={Check} label="Проверить" onClick={() => handleVerifyButtonClick(task.id)} large />
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
    const userData = useSelector((state) => state.user.data);
    const userId = userData.id;
    const dispatch = useDispatch();

    const [showTasks, setShowTasks] = useState(false);
    const [showBusters, setShowBusters] = useState(false);
    const [showUpgrades, setShowUpgrades] = useState(false);
    const [showRewards, setShowRewards] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        lockScroll()

        async function fetchTasks() {
            const req = await fetch('/api/tasks/get', { cache: 'no-store' });
            const res = await req.json();
            setTasks(res.data);
        }

        async function fetchCompletedTasks() {
            const req = await fetch(`/api/tasks/completed?id=${userId}`, { cache: 'no-store' });
            const res = await req.json();
            if (res.result) {
                dispatch(updateUserCompletedTasks(res.data))
                setCompletedTasks(res.data)
            }
        }

        fetchCompletedTasks();
        fetchTasks();
    }, []);

    const checkIsCompleted = (taskId) => {
        const found = completedTasks.find(el => {
            return el === taskId
        })

        return found
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <button 
                    className="w-full p-4 flex justify-between items-center bg-gray-700 rounded-xl mb-6"
                    onClick={() => setShowBusters(true)}
                >
                    <div className="flex items-center">
                    <Rocket size={24} className="mr-2 text-white"/>
                    <h2 className="text-lg font-bold text-white">Бустеры</h2>
                    </div>
                    <ChevronRight size={24} className='text-white'/>
                </button>

                <button 
                    className="w-full p-4 flex justify-between items-center bg-gray-700 rounded-xl mb-6"
                    onClick={() => setShowUpgrades(true)}
                >
                    <div className="flex items-center">
                    <SquarePlus size={24} className="mr-2 text-white"/>
                    <h2 className="text-lg font-bold text-white">Улучшения</h2>
                    </div>
                    <ChevronRight size={24} className='text-white'/>
                </button>

                <button 
                    className="w-full p-4 flex justify-between items-center bg-gray-700 rounded-xl mb-6"
                    onClick={() => setShowTasks(true)}
                >
                    <div className="flex items-center">
                    <Coins size={24} className="mr-2 text-white" />
                    <h2 className="text-lg font-bold text-white">Задания</h2>
                    </div>
                    <ChevronRight size={24} className='text-white'/>
                </button>

                <button 
                    className="w-full p-4 flex justify-between items-center bg-gray-700 rounded-xl mb-6"
                    onClick={() => setShowRewards(true)}
                >
                    <div className="flex items-center">
                    <Trophy size={24} className="mr-2 text-white"/>
                    <h2 className="text-lg font-bold text-white">Награды</h2>
                    </div>
                    <ChevronRight size={24} className='text-white'/>
                </button>
            </div>

            {showBusters && (
                <div className={styles.tasksPopup}>
                    <div className={styles.tasksPopupContent}>
                        <div className={styles.tasksPopupHeader}>
                            <h2 className={styles.tasksPopupTitle}>Бустеры</h2>
                            <button onClick={() => setShowBusters(false)} className={styles.closeButton}><XCircle size={30} /></button>
                        </div>
                        <div style={infoBoxStyle}>
                            <p style={{fontSize: '0.9rem', lineHeight: '1.4'}}>Бустеры дают быстрый разовый эффект Каждый бустер доступен 3 раза в сутки, бесплатно</p>
                        </div>

                        <Boosters/>
                    </div>
                </div>
            )}

            {showUpgrades && (
                <div className={styles.tasksPopup}>
                    <div className={styles.tasksPopupContent}>
                        <div className={styles.tasksPopupHeader}>
                            <h2 className={styles.tasksPopupTitle}>Бустеры</h2>
                            <button onClick={() => setShowUpgrades(false)} className={styles.closeButton}><XCircle size={30} /></button>
                        </div>
                        <div style={infoBoxStyle}>
                            <p style={{fontSize: '0.9rem', lineHeight: '1.4'}}>Улучшения дают постоянный эффект и прокачивают ваши возможности с каждым новым купленным левелом</p>
                        </div>

                        <Upgrades />
                    </div>
                </div>
            )}

            {/* Tasks Pop-up */}
            {showTasks && (
                <div className={styles.tasksPopup}>
                    <div className={styles.tasksPopupContent}>
                        <div className={styles.tasksPopupHeader}>
                            <h2 className={styles.tasksPopupTitle}>Задания</h2>
                            <button onClick={() => setShowTasks(false)} className={styles.closeButton}><XCircle size={30} /></button>
                        </div>
                        <div style={infoBoxStyle}>
                            <p style={{fontSize: '0.9rem', lineHeight: '1.4'}}>Подпишись на нас в соцсетях, выполни другие задания, и быстро получи крупные бонусы на баланс VNVNC</p>
                        </div>
                        {tasks.find(task => task.platform === "Подписки Telegram") && (
                            <div className={`bg-blue-700 rounded-xl overflow-hidden shadow-lg mb-5`}>
                                <div className={`p-3 flex items-center`}>
                                    <Send size={20} className="mr-2" />
                                    <h3 className="text-lg font-bold">Подписки Telegram</h3>
                                </div>
                                <div className="p-2 bg-gray-800 bg-opacity-30">
                                    {tasks.map((task, idx) => task.platform === "Подписки Telegram" &&  (
                                        <Task task={task} key={task.platform + idx} index={idx} isCompleted={checkIsCompleted(task.id)}/>
                                    ))}
                                </div>
                            </div>
                        )}
                        {tasks.find(task => task.platform === "Подписки Instagram") && (
                            <div className={`bg-purple-700 rounded-xl overflow-hidden shadow-lg mb-5`}>
                                <div className={`p-3 flex items-center`}>
                                    <Instagram size={20} className="mr-2" />
                                    <h3 className="text-lg font-bold">Подписки Instagram</h3>
                                </div>
                                <div className="p-2 bg-gray-800 bg-opacity-30">
                                    {tasks.map((task, idx) => task.platform === "Подписки Instagram" && (
                                        <InstagramTask task={task} key={task.platform + (idx * 3.1415)} index={idx} isCompleted={checkIsCompleted(task.id)}/>
                                    ))}
                                </div>
                            </div>
                        )}
                        {tasks.find(task => task.platform === "Буст Telegram Каналов") && (
                            <div className={`bg-teal-700 rounded-xl overflow-hidden shadow-lg mb-5`}>
                                <div className={`p-3 flex items-center`}>
                                    <RocketIcon size={20} className="mr-2" />
                                    <h3 className="text-lg font-bold">Буст Telegram Каналов</h3>
                                </div>
                                <div className="p-2 bg-gray-800 bg-opacity-30">
                                    {tasks.map((task, idx) => task.platform === "Буст Telegram Каналов" && (
                                        <Task task={task} key={task.platform + (idx * 1.1514)} index={idx} isBoost={true} isCompleted={checkIsCompleted(task.id)}/>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Rewards Pop-up */}
            {showRewards && (
                <ReferralRewards
                    setShowRewards={setShowRewards}
                />
            )}
        </div>
    );
};

export default CoinManiaBonusPage;
