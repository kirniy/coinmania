import supabase from "@/db/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("id");
  const { data: tasks, error: tasksError } = await supabase
    .from("user_tasks")
    .select('*')
    .eq("user_id", userId)

  if (tasksError && tasksError.code !== 'PGRST116') {
    console.error("Failed to fetch user:", tasksError);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }

  const result = tasks && tasks.length > 0 ? tasks.map(el => el.task_id) : [];

  return NextResponse.json({ result: true, data: result});
}