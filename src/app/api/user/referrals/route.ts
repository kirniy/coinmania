import supabase from "@/db/supabase"
import { NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const referrerId = searchParams.get('id');

        if (!referrerId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const { data: referrals, error } = await supabase
            .from('referrals')
            .select(`
                referred_id,
                reward_claimed,
                users!referrals_referred_id_fkey (
                    id,
                    first_name,
                    last_name
                )
            `)
            .eq('referrer_id', referrerId);
        
        if (error) {
            console.error('Ошибка при получении приглашённых пользователей:', error);
            return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
        }
        
        return NextResponse.json({ referrals }, { status: 200 });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};
