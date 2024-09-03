import { NextResponse, NextRequest } from "next/server";
import supabase from "@/db/supabase";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {    
    const { id, scores, energy } = await req.json();

    if (!id || !scores || !energy) {
        return NextResponse.json({error: 'Missing parameters'}, {status: 500})
    }

    const { error } = await supabase
        .from('users')
        .update({ scores: scores, energy: energy })
        .eq('id', id);
        
    if (error) {
        console.error('Error syncing user with DB');
        return NextResponse.json({error: 'Error syncing user with DB'}, {status: 500});
    }

    return NextResponse.json({ok: true}, {status: 200});
}