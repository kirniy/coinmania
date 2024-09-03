import { updateUserScores } from "@/store/userSlice"
import { XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import styles from '../CoinManiaBonusPage.module.css'

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

const handleButtonClick = async (setShowTaskModal, setUserKey, userId, taskId) => {
    try {
        const req = await fetch(`/api/instagram_subscribers?id=${userId}&task_id=${taskId}`)
        const res = await req.json();

        if (res.result) {
            setUserKey(res.key)
            setShowTaskModal(true);
        } else {
            if(res.error) alert(res.error)
            else alert('Что-то пошло не так');
        }
    } catch (error) {
        alert(error)
    }
};

async function handleVerifyButtonClick(setShowTaskModal, inputValue, userId, dispatch, taskId) {
    try {
        const req = await fetch(`/api/instagram_subscribers/check?id=${userId}&task_id=${taskId}&key=${inputValue}`);
        const res = await req.json();
        if (res.result) {
            setShowTaskModal(false);
            alert('Подписка успешно проверена');
            dispatch(updateUserScores(res.scores))
        } else {
            if(res.error) alert(res.error)
            else alert('Код подтверждения неверен');
        }
    } catch (error) {
        alert(error)
    }
}

const InstagramTask = ({task, index}) => {
    const userData = useSelector((state) => state.user.data);
    const userId = userData.id;
    const dispatch = useDispatch();

    const [userKey, setUserKey] = useState(null)
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [inputValue, setInputValue] = useState('')

    const isMain = index === 0 || index === 3;
    const status = 'pending';

    return (
        <React.Fragment> 
            <button 
                onClick={() => handleButtonClick(setShowTaskModal, setUserKey, userId, task.id)} 
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
            {showTaskModal && (
                <div className={styles.taskModal}>
                    <div className={styles.taskModalContent}>
                        <div className={styles.taskModalCloseContainer}>
                            <button onClick={() => setShowTaskModal(false)} className={styles.closeButton}><XCircle size={30} /></button>
                        </div>
                        <p>Используйте код {userKey} чтобы получить бонусы. Скопируйте код и перейдите в инстаграм одним нажатием на кнопку. После подписки отправте этот код к нам в директ.</p>
                        <a href={task.link} className={styles.taskModalButton}>Подписаться</a>
                        <input type="text" autoCapitalize="off" autoComplete="off" style={inputStyle()} onChange={(e)=>setInputValue(e.target.value)}/>
                        <button disabled={inputValue?.length === 0} onClick={() => handleVerifyButtonClick(setShowTaskModal, inputValue, userId, dispatch, task.id)} className={styles.taskModalButton}>Проверить</button>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

export default InstagramTask;