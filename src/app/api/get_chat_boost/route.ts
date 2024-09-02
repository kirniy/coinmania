import supabase from "@/db/supabase"
import { NextResponse } from "next/server"

interface Boost {
  boost_id: string,
  add_date: number,
  expiration_date: number,
  source: {
    source: string,
    user: {
      id: number,
      is_bot: boolean,
      first_name: string,
      last_name: string,
      username: string,
      language_code: string,
      is_premium: boolean
    }
  }
}

interface TgApiResponse {
  ok: boolean;
  result?: {
    boosts: Boost[]
  };
  eror_code?: number;
  description?: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const taskId = searchParams.get("task_id");

  if (!id || !taskId) {
    return NextResponse.json({ error: "Missing user ID or task ID" }, { status: 400 });
  }

  const {data: task, error: taskFetchinError} = await supabase
    .from("tasks")
    .select("tg_id, reward")
    .eq("id", taskId)
    .single();

    if (taskFetchinError) {
        console.error("Failed to fetch user task:", taskFetchinError);
        return NextResponse.json({ error: "Failed to fetch user task" }, { status: 500 });
    }

  const body = {
    chat_id: task.tg_id,
    user_id: id,
  };

  const BOT_TOKEN = process.env.BOT_TOKEN;

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getUserChatBoosts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  const tgApiResponse: TgApiResponse = await response.json();
  console.log('tgApiResponse', tgApiResponse, tgApiResponse.result?.boosts[0]);

  if (
    tgApiResponse.ok &&
    tgApiResponse.result?.boosts &&
    tgApiResponse.result?.boosts.length >= 4
  ) {
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("scores")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch user:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      );
    }

    const { data: existingCompletedTask, error: existingTaskError } = await supabase
      .from("user_tasks")
      .select('*')
      .eq("user_id", id)
      .eq("task_id", taskId);

    if (existingTaskError) {
      console.error("Failed to fetch user task:", existingTaskError);
      return NextResponse.json({ error: "Failed to fetch user task" }, { status: 500 });
    }

    if (existingCompletedTask.length > 0) {
      return NextResponse.json({ error: "Task already completed" }, { status: 400 });
    }

    interface Task {
      id: string;
      name: string;
      reward: number;
    }
    interface CompletedTask {
      tasks: Task;
    }

    const { data: completedTask, error: completedTaskError}: { data: CompletedTask | null, error: any } = await supabase
      .from("user_tasks")
      .insert([{
        user_id: id,
        task_id: taskId,
      }])

    if (completedTaskError) {
      console.error("Failed to create user task:", completedTaskError);
      return NextResponse.json({ error: "Failed to create user task" }, { status: 500 });
    }

    const reward = task.reward;

    const { data: updatedUser, error: userUpdateError } = await supabase
      .from("users")
      .update({
        scores: user.scores + reward,
      })
      .eq("id", id);

    return NextResponse.json({ ok: true, scores: user.scores + reward });
  }

  return Response.json({ ok: false });
}