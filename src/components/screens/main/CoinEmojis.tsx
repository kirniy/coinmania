import { CoinEmoji as EmojiType } from "@/types/coinEmoji";
import { Dispatch, SetStateAction } from "react";
import React, { useEffect, useRef } from "react";

interface coinEmojisProps {
    emojis: EmojiType[],
    setCoinEmojis: Dispatch<SetStateAction<EmojiType[]>>,
}

const CoinEmojis: React.FC<coinEmojisProps> = ({ emojis, setCoinEmojis }) => {

    const lastUpdateTimeRef = useRef(Date.now());

    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            const currentTime = Date.now();
            const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000; // time in seconds
            lastUpdateTimeRef.current = currentTime;            

            setCoinEmojis(prevEmojis =>
                prevEmojis
                    .map(emoji => ({
                        ...emoji,
                        x: emoji.x + emoji.speedX * deltaTime,
                        y: emoji.y + emoji.speedY * deltaTime + (0.5 * 500 * deltaTime * deltaTime),
                        speedY: emoji.speedY + 500 * deltaTime,
                        opacity: 1 - (currentTime - emoji.createdAt) / 2000 // Добавляем свойство opacity
                    }))
                .filter(emoji => (currentTime - emoji.createdAt) < 2000 && emoji.y < window.innerHeight && emoji.y > -50)
            );

            animationFrameId = requestAnimationFrame(animate);
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId)            
        };
    }, []);

    return (
        <>
            {emojis.map(emoji => (
                <div
                    key={emoji.id}
                    className={'absolute transition-opacity duration-1000'}
                    style={{
                        left: `${emoji.x}px`,
                        top: `${emoji.y}px`,
                        fontSize: `${emoji.size}px`,
                        opacity: emoji.opacity ?? 1, // Применяем opacity к каждому эмодзи
                    }}
                >
                    {emoji.emoji}
                </div>
            ))}
        </>
    )
}

export default CoinEmojis;
