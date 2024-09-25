import React from 'react';
import Image from 'next/image';
import coinImage from '@/../public/images/coin.png';

type AmountDisplayProps = {
    amount: number,
    className?: string,
    coinSize?: number,
}
export const AmountDisplay = ({ amount, className = '', coinSize = 20 }: AmountDisplayProps) => {

    return (
        <div className={`inline-flex items-center gap-[0.5em] ${className}`}>
            <Image
                src={coinImage}
                alt='coin'
                width={coinSize}
                height={coinSize}
                quality={90}
                className='drop-shadow-lg'
            />
            <span className='self-baseline'>
                {amount.toLocaleString()}
            </span>
        </div>
    );
}