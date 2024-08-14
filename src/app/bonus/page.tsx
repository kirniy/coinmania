"use client";

import Loader from "@/components/loader/loader"
import Bonus from "@/components/screens/bonus/Bonus"
import { useContext, useEffect } from "react"
import { webAppContext } from "../context"
import { LoadingContext } from '../context/LoaderContext'

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
            {app.version ? (
                <Bonus />
            ) : (
                <Loader loading={isLoading} />
            )}
        </>
    );
}
