import supabase from "@/db/supabase"
import { NextRequest, NextResponse } from 'next/server'
import { BOOSTERS } from "@/constants/earn";
import type { Booster } from "@/types/boosters";
import { checkIsSameDay } from "@/utils/dates";

export const dynamic = "force-dynamic"

async function decrease_points(user: string, points: number): Promise<void> {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("scores")
            .eq("id", user)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            throw new Error("User not found");
        }

        const currentScores: number = data.scores;
        if (currentScores < points) {
            throw new Error("Insufficient points");
        }

        const { error: updateError } = await supabase
            .from("users")
            .update({ scores: currentScores - points })
            .eq("id", user);

        if (updateError) {
            throw new Error(updateError.message);
        }

        console.log("Points decreased successfully");
    } catch (error) {
        console.error("Error decreasing points:", error);
        throw error;
    }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userid');
        const boosterSlug = searchParams.get('slug');

        const currentTime = new Date();

        if (!userId || !boosterSlug) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        if (!BOOSTERS.find(booster => booster.slug === boosterSlug)) {
            return NextResponse.json({ error: "Incorrect booster slug" }, { status: 400 });
        }

        const booster : Booster = BOOSTERS.find(booster => booster.slug === boosterSlug)!;

        const boosterDuration = booster.duration * 1000;

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

        const lastBoostTime = user[`last_${booster.slug}_time`] ? new Date(user[`last_${booster.slug}_time`]) : new Date(0);
        const isSameDay = checkIsSameDay(lastBoostTime, currentTime);
        const boostsToday = isSameDay
            ? user[`daily_${booster.slug}_count`] ?? booster.maxUsePerDay
            : booster.maxUsePerDay;
            
        const isBoostLimitReached = isSameDay && boostsToday <= 0;

        const endTime = new Date(currentTime.getTime() + boosterDuration); 

        const response = {
            isLimitReached: isBoostLimitReached,
            newAvailableBoostCount: isBoostLimitReached ? 0 : (boostsToday - 1),
            endTime: endTime,
            remainingTime: boosterDuration,
            data: null,
        };

        if (!isBoostLimitReached) {
            const updatedFields = {
                [`daily_${booster.slug}_count`]: boostsToday - 1,
                [`last_${booster.slug}_time`]: endTime.toISOString(),
            };

            if (booster.action === 'resetEnergy') {
                updatedFields.energy = user.maxenergy;

                response.data = user.maxenergy;
            }

            const { error: updateError } = await supabase
                .from('users')
                .update(updatedFields)
                .eq('id', userId)

            if (updateError) {
                console.error("Failed to update user:", updateError);
                return NextResponse.json({ result: false, error: "Failed to update user" }, { status: 500 });
            }
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
