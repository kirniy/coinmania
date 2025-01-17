"use client";

import Loader from "@/components/loader/loader"
import Slots from "@/components/screens/game/Slots"
import { useContext, useEffect, useState } from "react"
import { webAppContext } from "../context"
import { LoadingContext } from '../context/LoaderContext'
import Stub from "@/components/screens/stub/Stub";
import { GAME_START_DATE } from "@/constants/game";

export default function Home() {
    const {app} = useContext(webAppContext);
    const { isLoading, setLoading } = useContext(LoadingContext);
    const [time, setTime] = useState<number | null>(null)
    let now = new Date();
    const [showSlots, setShowSlots] = useState(GAME_START_DATE <= now);

    function checkShowSlots() {
        now = new Date();
        if(GAME_START_DATE > now) {
            console.log("don't show slots");
            setShowSlots(false)
        } else {
            console.log("show slots");
            setShowSlots(true)
        }
    }

    
    useEffect(() => {
        fetch('/api/get_server_time').then(res => res.json()).then(data => {
            const date = new Date(data.time).getTime();
            setTime(date)
            checkShowSlots();
        })
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {            
            checkShowSlots();
        }, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [showSlots, setShowSlots])
    

    if (isLoading) {
        return <Loader loading={isLoading} />;
    }

    return (
        <>
            {/*{app.version ? (*/}
            {/*    <div className="h-full w-full text-center pt-4">*/}
            {/*        <code className="">{app.colorScheme}</code>*/}
            {/*        <h3 className="font-bold mb-1 text-xl">Welcome {app.initDataUnsafe.user?.first_name}!</h3>*/}
            {/*        <div className="font-medium text-sm text-center">I&apos;m Mini App for Telegram</div>*/}
            {/*        <a className="mt-6 block text-lg text-cyan-500 font-bold" href="https://t.me/thismisterit">My Telegram Channel</a>*/}
            {/*    </div>*/}
            {/*) : (*/}
            {/*    "loading"*/}
            {/*)}*/}

            <>
                {app.version ? (
                !showSlots ? (
                    <Stub serverTime={time} />
                ) : (
                    <Slots />
                )
                ) : (
                <Loader loading={isLoading} />
                )}
            </>
        </>
    );
}
