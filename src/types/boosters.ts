export type Booster = {
    name: string,
    slug: 'full_tank' | 'tap_boost',
    description?: string
    duration: number,
    maxUsePerDay: number,
    action: string,
    icon: any,
    bgColor: string,
};
