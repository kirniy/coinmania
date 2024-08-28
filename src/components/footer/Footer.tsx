"use client";

import { TABS } from '@/constants/tabs.js'
import { RootState } from '@/store/rootReducer'
import { setActiveTab } from '@/store/tabSlice'
import Link from 'next/link'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Footer.module.css'

const Footer = () => {
    const getInitialTab = () => {
        const activeTab = TABS.find(el => el.path === window.location.pathname);

        dispatch(setActiveTab(activeTab?.name || 'Home'));
    }

    useEffect(() => {
        getInitialTab();
    }, [])

    const activeTab = useSelector((state: RootState) => state.tab.activeTab);
    const dispatch = useDispatch();

    const handleTabChange = (tab: string) => {
        dispatch(setActiveTab(tab));
    };

    return (
        <div className={'z-50 w-full fixed bottom-0'}>
            <div className={styles.footerContainer}>
                <div className={styles.navbar}>
                    <div className={styles.frostedGlass} />

                    <nav className={styles.nav}>
                        {TABS.map((tab) => (
                            <Link
                                key={tab.name}
                                href={tab.path}
                                className={styles.tabLink}
                                style={{
                                    background: activeTab === tab.name
                                        ? `linear-gradient(145deg, ${tab.color}, ${tab.color}aa)`
                                        : 'rgba(255, 255, 255, 0.05)',
                                    boxShadow: activeTab === tab.name
                                        ? `0 10px 20px rgba(0,0,0,0.2), 0 0 0 3px ${tab.color}55`
                                        : '0 4px 6px rgba(0,0,0,0.1)',
                                }}
                                onClick={() => handleTabChange(tab.name)}
                            >
                                <div
                                    className={styles.tabIcon}
                                    style={{
                                        filter: activeTab === tab.name ? 'none' : 'grayscale(100%)',
                                    }}
                                >
                                    {tab.icon}
                                </div>
                                <span
                                    className={styles.tabText}
                                    style={{
                                        color: activeTab === tab.name ? 'white' : 'rgba(255,255,255,0.6)',
                                    }}
                                >
                                    {tab.name}
                                </span>
                                {activeTab === tab.name && (
                                    <div
                                        className={styles.activeIndicator}
                                        style={{
                                            boxShadow: `0 0 10px ${tab.color}, 0 0 20px ${tab.color}`,
                                        }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Footer;
