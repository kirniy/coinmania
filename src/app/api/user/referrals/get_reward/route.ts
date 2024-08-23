import supabase from "@/db/supabase"
import { NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export const GET = async (req: Request) => {   
    try {
        const { searchParams } = new URL(req.url);
        const referralId = searchParams.get('referralId');
        const userId = searchParams.get('userId')

        if (!referralId || !userId) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        // Обновляем статус награды для реферала
        const { error: referralUpdateError } = await supabase
            .from('referrals')
            .update({ reward_claimed: true })
            .eq('id', referralId);

        if (referralUpdateError) {
            console.error('Ошибка при обновлении статуса награды:', referralUpdateError);
        }

        // Получение данных пользователя из базы данных
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('scores')
            .eq('id', userId)
            .single();

        if (fetchError) {
            console.error("Failed to fetch user:", fetchError);
            return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
        }

        const { data: updatedUser, error: userUpdateError } = await supabase
            .from('users')
            .update({
                scores: user.scores + 25000,
            })
            .eq('id', userId);

        if (userUpdateError) {
            console.error("Failed to update user:", userUpdateError);
            return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
        }
        
        return NextResponse.json({ scores: user.scores + 25000 }, { status: 200 });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};
