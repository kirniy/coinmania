import supabase from "@/db/supabase"
import { NextRequest, NextResponse } from 'next/server'

async function generateRandomCode(length: number): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function isCodeUnique(code: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('instagram_subscribers')
    .select('key_from_user')
    .eq('key_from_user', code);

  if (error) {
    console.error('Error checking code uniqueness:', error);
    return false;
  }

  return data.length === 0;
}

async function generateUniqueCodes(): Promise<[string, string]> {
  const length = 8;
  let code1: string;
  let code2: string;

  do {
    code1 = await generateRandomCode(length);
  } while (!(await isCodeUnique(code1)));

  code2 = await generateRandomCode(length);

  return [code1, code2];
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("id");
    const taskId = searchParams.get("task_id");

    if (!userId || !taskId) {
      return NextResponse.json({ error: "Missing user ID or task ID" }, { status: 400 });
    }

    const { data: subs, error: fetchSubsError } = await supabase
      .from('instagram_subscribers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchSubsError && fetchSubsError.code !== 'PGRST116') {
      console.error("Failed to fetch user:", fetchSubsError);
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }

    if (subs?.key_from_user) {
      return NextResponse.json({ result: true, key: subs.key_from_user});
    }

    const [code1, code2] = await generateUniqueCodes();

    const { data: completedSubs, error: completedSubsError } = await supabase
      .from('instagram_subscribers')
      .insert([
        {
          user_id: userId,
          task_id: taskId,
          key_from_user: code1,
          key_to_user: code2
        }
      ]);

    if (completedSubsError) {
      console.error("Failed to update user:", completedSubsError);
      return NextResponse.json({ error: "Не удалось сгенерировать ключ для отправки" }, { status: 500 });
    }

    return NextResponse.json({
      result: true,
      key: code1
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
