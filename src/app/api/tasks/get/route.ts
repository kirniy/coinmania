import { NextRequest, NextResponse } from "next/server";
import supabase from "@/db/supabase"

export async function GET(req: NextRequest) {
    const res = await supabase
        .from('tasks')
        .select('*')
    return NextResponse.json(res);
}