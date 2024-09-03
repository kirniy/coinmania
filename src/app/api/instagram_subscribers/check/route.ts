import supabase from "@/db/supabase"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("id");
  const taskId = searchParams.get("task_id");
  const key = searchParams.get("key");

  if (!userId || !taskId || !key) {
    return NextResponse.json({ error: "Missing user ID or task ID" }, { status: 400 });
  }

  const {data: subs, error: fetchSubsError} = await supabase
    .from("instagram_subscribers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchSubsError) {
    console.error("Failed to fetch user task:", fetchSubsError);
    return NextResponse.json({ error: "Failed to fetch user task" }, { status: 500 });
  }

  if (subs.key_to_user === key) {
    const { data: existingCompletedTask, error: existingTaskError } = await supabase
      .from("user_tasks")
      .select('*')
      .eq("user_id", userId)
      .eq("task_id", taskId);
    
    if (existingTaskError) {
      console.error("Failed to fetch user task:", existingTaskError);
      return NextResponse.json({ error: "Failed to fetch user task" }, { status: 500 });
    }

    if (existingCompletedTask.length > 0) {
      return NextResponse.json({ error: "Task already completed" }, { status: 400 });
    }

    const { data: completedTask, error: completedTaskError} = await supabase
      .from("user_tasks")
      .insert([{
        user_id: userId,
        task_id: taskId,
      }])
      
    if (completedTaskError) {
      console.error("Failed to create user task:", completedTaskError);
      return NextResponse.json({ error: "Failed to create user task" }, { status: 500 });
    }

    const {data: task, error: taskFetchinError} = await supabase
      .from("tasks")
      .select("reward")
      .eq("id", taskId)
      .single();

    if (taskFetchinError) {
        console.error("Failed to fetch user task:", taskFetchinError);
        return NextResponse.json({ error: "Failed to fetch user task" }, { status: 500 });
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("scores")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch user:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      );
    }

    const reward = task.reward;

    const { data: updatedUser, error: userUpdateError } = await supabase
      .from("users")
      .update({
        scores: user.scores + reward,
      })
      .eq("id", userId);

    return NextResponse.json({ result: true, scores: user.scores + reward });
  }
  return Response.json({ result: false });
}
