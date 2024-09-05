import supabase from "@/db/supabase"
import { NextResponse, NextRequest } from 'next/server'
import { REFERRAL_TASKS } from "@/constants/earn";

export const dynamic = "force-dynamic"

export const POST = async (req: NextRequest) => {
    try {
        const { id: userId, level: rewardLevel } = await req.json();

        if (!userId || !rewardLevel) {
            return NextResponse.json({ error: "Missing user ID or reward level" }, { status: 400 });
        }

        const rewardLevelInt = parseInt(rewardLevel);

        const referralTask = REFERRAL_TASKS.find(task => task.goal === rewardLevelInt)

        if (!referralTask) {
            return NextResponse.json({ error: "Reward not found" }, { status: 400 });
        }

        const { data: existingRewardRecord, error } = await supabase
            .from('user_rewards')
            .select('*')
            .eq('user_id', userId)
            .eq('reward_level', referralTask.goal);
        
        if (error) {
            console.error('Ошибка при получении списка полученных наград:', error);
            return NextResponse.json({ error: "Failed to fetch user rewards" }, { status: 500 });
        }

        if (existingRewardRecord.length > 0) {
            return NextResponse.json({ error: "Награда уже была получена!" }, { status: 400 });
        }

        const { data: user, error: fetchUserError } = await supabase
            .from('users')
            .select(`
                scores,
                referrals!referrals_referrer_id_fkey (
                    id
                )    
            `)
            .eq('id', userId)
            .single();

        if (fetchUserError) {
            console.error(fetchUserError);
            
            return NextResponse.json({ error: "Failed to fetch user referrals" }, { status: 500 });
        }

        if (user.referrals.length < referralTask.goal) {
            return NextResponse.json({ error: "Не выполнены условия получения награды" }, { status: 400 });
        }

        const increasedScores = user.scores + referralTask.reward;

        const { error: updatingUserError } = await supabase
            .from('users')
            .update({
                scores: increasedScores,
            })
            .eq('id', userId)

        if (updatingUserError) {
            return NextResponse.json({ error: "Failed to update user scores" }, { status: 500 });
        }

        const { error: createRewardRecordError } = await supabase
            .from('user_rewards')
            .insert([
                { user_id: userId, reward_level: referralTask.goal, claimed: true, claimed_at: new Date() }
            ]);

        if (createRewardRecordError) {
            return NextResponse.json({ error: "Failed to create user reward record" }, { status: 500 });
        }
        
        return NextResponse.json({
            ok: true,
            scores: increasedScores
        }, { status: 200 });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};
