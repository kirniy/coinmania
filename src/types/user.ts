export interface UserData {
    id: string;
    first_name: string;
    last_name: string;
    username: string | null;
    last_login_time: string;
    energy: number | null;
    maxenergy: number;
    scores: number | null;
    energyresettime: string;
    daily_spin_count: number;
    last_spin_time: string | null;
    daily_tap_boost_count: number;
    last_tap_boost_time: string | null;
    daily_full_tank_count: number;
    last_full_tank_time: string | null;
    referal_id: string | null;
};