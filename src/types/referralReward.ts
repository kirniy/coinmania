export type referralReward = {
    goal: userReferralReward['reward_level'],
    reward: number,
}

export type userReferralReward = {
    reward_level: 3 | 5 | 10 | 20 | 50 | 100,
    claimed: boolean,
    claimed_at?: string,
}