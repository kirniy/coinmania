"use client";

import { webAppContext } from "@/app/context"
import { LoadingContext } from '@/app/context/LoaderContext'
import Header from "@/components/header/header"
import Loader from "@/components/loader/loader"
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface RootState {
    user: {
      data: any;
    }
}

const Profile = () => {
    const app = useContext(webAppContext);
    const userData = useSelector((state: RootState) => state.user.data);
    const { isLoading, setLoading } = useContext(LoadingContext);
    const [error, setError] = useState<string | null>(null);
    const [referralsCount, setReferralsCount] = useState(0);

    useEffect(() => {
        console.log("App data:", app);
    }, [app]);

    useEffect(() => {
        const fetchReferralsCount = async () => {
            try {
                const response = await fetch(`/api/user/referrals?id=${app.initDataUnsafe.user?.id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setReferralsCount(data.referralsCount);
            } catch (error) {
                console.error("Error fetching referrals count:", error);
            }
        };

        if (app.initDataUnsafe.user?.id) {
            fetchReferralsCount();
        }
    }, [app.initDataUnsafe.user?.id]);

    const copyToClipboard = () => {
        const referralLink = `https://t.me/hearthneuro_bot/demo?startapp=${app.initDataUnsafe.user?.id}`;
        navigator.clipboard.writeText(referralLink).then(() => {
            alert("Скопировано!");
        }, (err) => {
            alert("Ошибка копирования!");
        });
    };

    if (isLoading) {
        return <Loader loading={isLoading} />;
    }

    return (
        <div className="bg-zinc-950 min-h-screen flex flex-col items-center justify-center text-white p-6">
            <div className="w-full max-w-lg flex flex-col gap-6 mx-auto bg-gradient-to-br from-black to-zinc-900 rounded-xl shadow-lg overflow-hidden">
                <Header />

                <div className="flex flex-col items-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 w-full rounded-lg">
                    <div className="uppercase tracking-wide text-indigo-500 text-3xl font-extrabold">{app.initDataUnsafe.user?.first_name}</div>
                    <p className="mt-2 text-gray-400 text-lg">⭐ {userData?.scores}</p>
                </div>

                <div className="bg-gradient-to-br from-green-900 to-black p-6 rounded-lg shadow-inner">
                    <h2 className="text-2xl font-bold mb-4 bg-green-900 w-full text-center p-2 rounded-lg">📊 Статистика</h2>
                    <div className="flex flex-col gap-2 text-lg">
                        <p>👆 Всего тапов: {userData?.scores}</p>
                        <p>🕶 Друзей приглашено: {referralsCount}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center mt-4 rounded-md">
                    <button
                        className="text-zinc-950 font-bold text-center p-4 bg-yellow-400 rounded-md hover:bg-yellow-500 transition"
                        onClick={copyToClipboard}
                    >
                        Скопировать реферальную ссылку
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
