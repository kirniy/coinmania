"use client";

import React, { useContext, useState, useEffect } from 'react';
import Header from "@/components/header/header";
import { webAppContext } from "@/app/context";
import axios from 'axios';

interface Task {
    id: string;
    name: string;
    platform: string;
    reward: number;
    status: 'pending' | 'checking' | 'completed';
    link: string;
}

const telegramTasks: Task[] = [
    { id: "1", name: "VNVNC", platform: "Telegram", reward: 5000, status: 'pending', link: "https://t.me/vnvnc_spb" },
    { id: "2", name: "Маленькая Виновница", platform: "Telegram", reward: 5000, status: 'pending', link: "https://t.me/vinovnica" },
    { id: "3", name: "ANGAR", platform: "Telegram", reward: 5000, status: 'pending', link: "https://t.me/angarclubspb" },
];

const instagramTasks: Task[] = [
    { id: "4", name: "VNVNC", platform: "Instagram", reward: 10000, status: 'pending', link: "https://www.instagram.com/vnvnc_spb/" },
    { id: "5", name: "Маленькая Виновница", platform: "Instagram", reward: 10000, status: 'pending', link: "https://instagram.com/vinovnica" },
    { id: "6", name: "ANGAR", platform: "Instagram", reward: 10000, status: 'pending', link: "https://www.instagram.com/ang4rclub/" },
];

const Tasks = () => {
    const app = useContext(webAppContext);
    const [loadingTasks, setLoadingTasks] = useState<{ [key: string]: boolean }>({});
    const [taskStatuses, setTaskStatuses] = useState<{ [key: string]: string }>({});

    const fetchTaskStatuses = async () => {
        try {
            const { data } = await axios.get(`/api/tasks/update?userId=${app.initDataUnsafe.user?.id}`);
            const statuses = data.tasks.reduce((acc: any, task: any) => {
                acc[task.id] = task.status;
                return acc;
            }, {});
            setTaskStatuses(statuses);
        } catch (error) {
            console.error("Failed to fetch task statuses:", error);
        }
    };

    useEffect(() => {
        fetchTaskStatuses();
    }, []);

    const handleTaskClick = async (task: Task) => {
        setLoadingTasks((prev) => ({ ...prev, [task.id]: true }));
        try {
            await axios.post('/api/tasks/update', {
                taskId: task.id,
                userId: app.initDataUnsafe.user?.id,
                name: task.name,
                platform: task.platform,
                reward: task.reward,
                link: task.link
            });
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            for (const task of [...telegramTasks, ...instagramTasks]) {
                if (loadingTasks[task.id]) {
                    try {
                        const { data } = await axios.get(`/api/tasks/update?taskId=${task.id}&userId=${app.initDataUnsafe.user?.id}`);
                        if (data.isCheckTimePassed) {
                            setLoadingTasks((prev) => ({ ...prev, [task.id]: false }));
                        }
                    } catch (error) {
                        console.error("Failed to check task time:", error);
                    }
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [loadingTasks]);

    return (
        <div className="bg-black min-h-svh flex flex-col items-center justify-center text-white p-4">
            <div className="w-full max-w-md flex-col flex gap-4 mx-auto bg-gradient-to-r from-black to-zinc-950 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <Header />

                <div className="p-4 text-center">
                    <h1 className="text-2xl font-bold text-white">📱 ЗАДАНИЯ</h1>
                </div>
                <div className="p-2 bg-gradient-to-r from-blue-900 to-gray-900 rounded-lg mb-4">
                    <h2 className="text-lg font-bold">Подписаться на Telegram</h2>
                    {telegramTasks.map((task) => (
                        <div key={task.id} className="flex flex-col items-center text-center bg-zinc-950 p-2 rounded-lg mt-2">
                            <div className="flex items-center mb-2">
                                <p className="font-bold">{task.name}</p>
                            </div>
                            <p className="mb-2">{task.reward} ⭐</p>
                            <a href={task.link} target="_blank" rel="noopener noreferrer" className="w-full">
                                <button
                                    className={`py-1 px-3 rounded-lg w-full ${taskStatuses[task.id] === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}
                                    onClick={() => handleTaskClick(task)}
                                    disabled={loadingTasks[task.id]}
                                >
                                    {loadingTasks[task.id] ? 'Проверяется...' : taskStatuses[task.id] === 'completed' ? 'Выполнено' : 'Подписаться'}
                                </button>
                            </a>
                        </div>
                    ))}
                </div>
                <div className="p-2 bg-gradient-to-r from-red-900 to-black rounded-lg mb-4">
                    <h2 className="text-lg font-bold">Подписаться на Instagram</h2>
                    {instagramTasks.map((task) => (
                        <div key={task.id} className="flex flex-col items-center text-center bg-zinc-950 p-2 rounded-lg mt-2">
                            <div className="flex items-center mb-2">
                                <p className="font-bold">{task.name}</p>
                            </div>
                            <p className="mb-2">{task.reward} ⭐</p>
                            <a href={task.link} target="_blank" rel="noopener noreferrer" className="w-full">
                                <button
                                    className={`py-1 px-3 rounded-lg w-full ${taskStatuses[task.id] === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}
                                    onClick={() => handleTaskClick(task)}
                                    disabled={loadingTasks[task.id]}
                                >
                                    {loadingTasks[task.id] ? 'Проверяется...' : taskStatuses[task.id] === 'completed' ? 'Выполнено' : 'Подписаться'}
                                </button>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
