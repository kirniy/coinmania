"use client";

import Loader from "@/components/loader/loader";
import Frens from "@/components/screens/frens/Frens";
import { useContext, useEffect } from "react";
import { webAppContext } from "../context";
import { LoadingContext } from '../context/LoaderContext';

export default function Home() {
    const app = useContext(webAppContext);
    const { isLoading, setLoading } = useContext(LoadingContext);

    useEffect(() => {
        if (app.version) {
            setTimeout(() => {
                setLoading(false);
              }, 3000)
        }
    }, [app.version]);

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
                    <Frens />
                ) : (
                    <Loader loading={isLoading} />
                )}
            </>
        </>
    );
}
