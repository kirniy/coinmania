export type upgrade = {
    type: upgradeType,
    name: string,
    maxLevel: number,
    levels: upgradeLevel[],
}

export type upgradeLevel = {
    level: number,
    cost: number,
}

export type upgradeType = 'tap_value' | 'energy_limit' | 'recharging_speed'

export const UPGRADES: upgrade[] = [
    {
        type: 'tap_value',
        name: 'Tap Value',
        maxLevel: 5,
        levels: [
            {
                level: 1,
                cost: 0,
            },
            {
                level: 2,
                cost: 2000,
            },
            {
                level: 3,
                cost: 5000,
            },
            {
                level: 4,
                cost: 8000,
            },
            {
                level: 5,
                cost: 16000,
            },
        ]
    },
    {
        type: 'energy_limit',
        name: 'Energy Limit',
        maxLevel: 5,
        levels: [
            {
                level: 1,
                cost: 0,
            },
            {
                level: 2,
                cost: 200,
            },
            {
                level: 3,
                cost: 500,
            },
            {
                level: 4,
                cost: 1000,
            },
            {
                level: 5,
                cost: 2000,
            },
        ]
    },
]