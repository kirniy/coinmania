// pages/api/slots/check.js

import { NextRequest, NextResponse } from 'next/server';
import supabase from "@/db/supabase";
import { checkIsSameDay } from '@/utils/dates';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ result: false, error: "Invalid request data" }, { status: 400 });
        }

        // Fetch user data
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (fetchError) {
            console.error("Failed to fetch user:", fetchError);
            return NextResponse.json({ result: false, error: "Failed to fetch user" }, { status: 500 });
        }

        if (!user) {
            return NextResponse.json({ result: false, error: "User not found" }, { status: 404 });
        }

        // Check spin restrictions
        const now = new Date();
        const lastSpinTime = user.last_spin_time ? new Date(user.last_spin_time) : new Date(0);
        const isSameDay = checkIsSameDay(lastSpinTime, now);
        const spinsToday = isSameDay
            ? user.daily_spin_count ?? 0
            : 0;

        const isSpinLimitReached = isSameDay && spinsToday >= 2;

        if (!isSpinLimitReached) {
            const { error: updateError } = await supabase
            .from('users')
            .update({
                daily_spin_count: spinsToday + 1,
                last_spin_time: new Date(),
            })
            .eq('id', userId)

            if (updateError) {
                console.error("Failed to update user:", updateError);
                return NextResponse.json({ result: false, error: "Failed to update user" }, { status: 500 });
            }
        }

        return NextResponse.json({
            isSpinLimitReached: isSpinLimitReached,
            newSpinCount: isSpinLimitReached ? 0 : (isSameDay ? spinsToday - 1 : 1),
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ result: false, error: "Internal server error" }, { status: 500 });
    }
}
