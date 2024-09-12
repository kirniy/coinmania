import { InnerModal } from '@/components/modal/InnerModal'
import { Modal } from '@/components/modal/Modal'
import { updateUserCompletedTasks, updateUserScores } from "@/store/userSlice"
import { Check, Coins, Rocket } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from "react-redux"
import ActionButton from './ActionButton'

const buttonStyle = {
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    ':active': {
        transform: 'scale(0.98)',
    }
};
const disabledButtonStyle = () => ({
    opacity: '0.5'
})
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
const inputStyle = () => ({
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color:' rgb(255, 255, 255)',
    textAlign: 'center',
    textShadow: 'rgba(0, 0, 0, 0.5) 2px 2px 4px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    padding: '5px 10px',
    border: '2px solid rgb(255, 255, 255)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
});

const InstagramTask = ({task, index, isCompleted = false}) => {
    const userData = useSelector((state) => state.user.data);
    const userId = userData.id;
    const dispatch = useDispatch();

    const [userKey, setUserKey] = useState(null)
    const [showTasksModal, setShowTasksModal] = useState(false);
    const [inputValue, setInputValue] = useState('')

    const [showSuccessAlert, setShowSuccessAlert] = useState([false, null]);
    const [showAlertSubscrNotFound, setShowAlertSubscrNotFound] = useState([false, null]);
    const [showErrorAlert, setShowErrorAlert] = useState([false, null]);
    const [status, setStatus] = useState('pending');

    const isMain = index === 0 || index === 3;
    
    useEffect(() => {
        if (isCompleted) {
            setStatus('completed');
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

    const handleButtonClick = async (taskId) => {
        try {
            const req = await fetch(`/api/instagram_subscribers?id=${userId}&task_id=${taskId}`)
            const res = await req.json();
    
            if (res.result) {
                setUserKey(res.key)
                setShowTasksModal(true);
            } else {
                if(res.error) setShowErrorAlert([true, res.error])
                else setShowAlertSubscrNotFound([true, 'Что то пошло не так']);
            }
        } catch (error) {
            setShowErrorAlert([true, error])
        }
    };
    
    async function handleVerifyButtonClick(taskId) {
        try {
            const req = await fetch(`/api/instagram_subscribers/check?id=${userId}&task_id=${taskId}&key=${inputValue}`);
            const res = await req.json();
            if (res.result) {
                setShowTasksModal(false);
                setShowSuccessAlert([true, 'Подписка успешно проверена']);
                dispatch(updateUserScores(res.scores))
                setStatus('completed');
                dispatch(updateUserCompletedTasks([taskId]))
            } else {
                if(res.error) setShowErrorAlert([true, res.error])
                else setShowAlertSubscrNotFound([true, 'Код подтверждения неверен']);
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
                    <div className="flex items-center bg-yellow-400 text-black px-2 py-1 rounded-full">
                        <Coins size={14} className="mr-1" />
                        <span className="text-xs font-bold">{task.reward}</span>
                    </div>
                )}
            </button> 
            {showTasksModal && 
            createPortal(
                <Modal onClose={handleModalClose}>
                    <div className="flex items-center mb-4">
                        <h3 className="text-white text-xl font-bold">{task.name}</h3>
                    </div>
                    <p className="text-white text-sm mb-4">Награда: {task.reward} 🪙</p>
                    <ActionButton icon={Rocket} label="Копировать и Подписаться" primary large isLink={true} link={task.link} />
                    <input className='mb-3' type="text" autoCapitalize="off" autoComplete="off" style={inputStyle()} onChange={(e)=>setInputValue(e.target.value)}/>
                    <ActionButton icon={Check} label="Проверить" disabled={inputValue?.length === 0} onClick={() => handleVerifyButtonClick(task.id)} style={inputValue?.length === 0 ? disabledButtonStyle() : {}} large />
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

export default InstagramTask;