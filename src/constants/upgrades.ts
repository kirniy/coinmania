import { Battery, Clock, Droplet } from 'lucide-react'

export type upgrade = {
    type: upgradeType,
    name: string,
    maxLevel: number,
    description: string,
    icon: any,
    levels: upgradeLevel[],
}

export type upgradeLevel = {
    level: number,
    cost: number,
    effect: string
}

export type upgradeType = 'tap_value' | 'energy_limit' | 'recharging_speed'

export const UPGRADES: upgrade[] = [
    {
        type: 'tap_value',
        name: 'Tap Value',
        maxLevel: 5,
        description: "Увеличивает базовое количество коинов за тап",
        icon: Droplet, 
        levels: [
            {
                level: 1,
                cost: 0,
                effect: "+1 коин за тап"
            },
            {
                level: 2,
                cost: 2000,
                effect: "+2 коина за тап"
            },
            {
                level: 3,
                cost: 5000,
                effect: "+3 коина за тап"
            },
            {
                level: 4,
                cost: 8000,
                effect: "+4 коина за тап"
            },
            {
                level: 5,
                cost: 16000,
                effect: "+5 коинов за тап"
            },
        ]
    },
    {
        type: 'energy_limit',
        name: 'Energy Limit',
        maxLevel: 5,
        description: "Увеличивает максимальный запас энергии",
        icon: Battery, 
        levels: [
            {
                level: 1,
                cost: 0,
                effect: "500 макс энергии",
            },
            {
                level: 2,
                cost: 200,
                effect: "1000 макс энергии",
            },
            {
                level: 3,
                cost: 500,
                effect: "1500 макс энергии",
            },
            {
                level: 4,
                cost: 1000,
                effect: "2000 макс энергии",
            },
            {
                level: 5,
                cost: 2000,
                effect: "2500 макс энергии",
            },
        ]
    },
    {
        type: 'recharging_speed',
        name: 'Recharging Speed',
        maxLevel: 5,
        description: "Ускоряет восстановление энергии",
        icon: Clock, 
        levels: [
            {
                level: 1,
                cost: 0,
                effect: "+1 энергии/сек",
            },
            {
                level: 2,
                cost: 2000,
                effect: "+2 энергии/сек",
            },
            {
                level: 3,
                cost: 10000,
                effect: "+3 энергии/сек",
            },
            {
                level: 4,
                cost: 100000,
                effect: "+4 энергии/сек",
            },
            {
                level: 5,
                cost: 250000,
                effect: "+5 энергии/сек",
            },
        ]
    },
]