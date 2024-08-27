import supabase from "@/db/supabase"
import { NextRequest, NextResponse } from 'next/server'
import { upgrade, UPGRADES } from "@/constants/upgrades";
import increase_max_energy from "../add_energy";

export const dynamic = "force-dynamic"

async function decrease_points(userId: string, points: number): Promise<number> {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("scores")
            .eq("id", userId)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            throw new Error("User not found");
        }

        const currentScores: number = data.scores;
        if (currentScores < points) {
            throw new Error("Недостаточно монет для покупки");
        }

        const { error: updateError } = await supabase
            .from("users")
            .update({ scores: currentScores - points })
            .eq("id", userId);

        if (updateError) {
            throw new Error(updateError.message);
        }

        console.log("Points decreased successfully");
        return currentScores - points;
    } catch (error: any) {
        console.error("Error decreasing points:", error);
        throw error.message;
    }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const upgradeType = searchParams.get('type');
        const levelParam = searchParams.get('level');

        if (!userId || !upgradeType || !levelParam) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const upgradeLevel: number = parseInt(levelParam);

        if (!UPGRADES.find(upgrade => upgrade.type === upgradeType)) {
            return NextResponse.json({ error: "Incorrect upgrade type" }, { status: 400 });
        }

        const upgrade : upgrade = UPGRADES.find(upgrade => upgrade.type === upgradeType)!;      

        // Fetch user data
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select(`
                *,
                upgrades (
                    ${upgrade.type}
                )
            `)
            .eq('id', userId)
            .single();        

        if (fetchError) {
            console.error("Failed to fetch user:", fetchError);
            return NextResponse.json({ result: false, error: "Failed to fetch user" }, { status: 500 });
        }

        if (!user) {
            return NextResponse.json({ result: false, error: "User not found" }, { status: 404 });
        }

        const currentUpgradeLevel = user.upgrades?.[upgrade.type] ?? 1;

        if (
            upgradeLevel <= currentUpgradeLevel
            || upgradeLevel - currentUpgradeLevel > 1
        ) {
            return NextResponse.json({ result: false, error: "Incorrect level" }, { status: 400 });
        }

        const upgradeCost = upgrade.levels.find(level => level.level === upgradeLevel)?.cost;

        if (!upgradeCost) {
            return NextResponse.json({ result: false, error: "Incorrect level" }, { status: 400 });
        }

        const updatedUserScores = await decrease_points(userId, upgradeCost)

        const { error: userUpdatingError } = await supabase
            .from('upgrades')
            .upsert({
                [upgrade.type]: upgradeLevel,
                user_id: userId,
            }, {
                onConflict: 'user_id'
            })
            .eq('user_id', userId)

        if (userUpdatingError) {
            return NextResponse.json({ result: false, error: "Error user updating" }, { status: 500 });
        }

        const response: {
            result: boolean,
            scores: number,
            maxEnergy?: number,
        } = {
            result: true,
            scores: updatedUserScores,
        }
        
        if (upgrade.type === 'energy_limit') {
            const updatedMaxEnergy = await increase_max_energy(userId, 500);
            response.maxEnergy = updatedMaxEnergy;
        }

        return NextResponse.json(response, {status: 200});

    } catch (error: any) {
        console.log(error);
        
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
