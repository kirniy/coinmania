"use client";

import Loader from "@/components/loader/loader"
import Bonus from "@/components/screens/bonus/Bonus"
import { useContext } from "react"
import { webAppContext } from "../context"
import { LoadingContext } from '../context/LoaderContext'

export default function Home() {
    const {app} = useContext(webAppContext);
    const { isLoading, setLoading } = useContext(LoadingContext);

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
