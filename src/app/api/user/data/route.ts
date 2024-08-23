import supabase from "@/db/supabase"
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    try {
        // Получение id пользователя из запроса
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        // Получение данных пользователя из базы данных
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select(`
                *,
                referrals!referrals_referrer_id_fkey (
                    id,
                    reward_claimed,
                    users!referrals_referred_id_fkey (
                        id,
                        first_name,
                        last_name
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error("Failed to fetch user:", fetchError);
            return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const currentTime = new Date();
        const tapBoostEndTime = new Date(user.last_tap_boost_time) ?? 0;
        const isBoostActive = currentTime < tapBoostEndTime;

        if (isBoostActive) {
            const remainingTime = tapBoostEndTime.getTime() - currentTime.getTime();

            user.tap_boost_remaining_time = remainingTime;
        }

        const serverTime = new Date();

        return NextResponse.json({ user, serverTime }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
