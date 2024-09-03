import { InnerModal } from '@/components/modal/InnerModal'
import { Modal } from '@/components/modal/Modal'
import { updateUserScores } from "@/store/userSlice"
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from "react-redux"

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
const inputStyle = () => ({
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color:' rgb(255, 255, 255)',
    textAlign: 'center',
    textShadow: 'rgba(0, 0, 0, 0.5) 2px 2px 4px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    padding: '5px 10px',
    margin: '5px auto',
    border: '2px solid rgb(255, 255, 255)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
});

const InstagramTask = ({task, index}) => {
    const userData = useSelector((state) => state.user.data);
    const userId = userData.id;
    const dispatch = useDispatch();

    const [userKey, setUserKey] = useState(null)
    const [showTasksModal, setShowTasksModal] = useState(false);
    const [inputValue, setInputValue] = useState('')

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
                onClick={() => handleButtonClick(setShowTasksModal, setUserKey, userId, task.id)} 
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
                    <p className="text-white mb-4">Используйте код {userKey} чтобы получить бонусы. Скопируйте код и перейдите в инстаграм {task.name} одним нажатием на кнопку. После подписки отправте этот код к нам в директ.</p>

                    <a href={task.link} className="w-full bg-yellow-500 text-center text-gray-900 py-2 rounded-lg font-semibold">Подписаться</a>
                    <input type="text" autoCapitalize="off" autoComplete="off" style={inputStyle()} onChange={(e)=>setInputValue(e.target.value)}/>
                    <button disabled={inputValue?.length === 0} onClick={() => handleVerifyButtonClick(task.id)} className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold">Проверить</button>
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