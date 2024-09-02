import supabase from "@/db/supabase"
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const energy = searchParams.get('energy');

        if (!id) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        if (!energy) {
            return NextResponse.json({ error: "Missing energy" }, { status: 400 });
        }

        const serverTime = new Date();

        const { data: user, error: updateUserError } = await supabase
            .from('users')
            .update({
                last_login_time: serverTime.toISOString(),
                energy: energy,
            })
            .eq('id', id);

        if (updateUserError) {
            return NextResponse.json({ error: "Request failed" }, { status: 500 });
        }

        return NextResponse.json({ status: 'success' }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
