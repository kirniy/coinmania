// POST https://api.telegram.org/bot5000573019:AAEpWwB5xxsu7I_tzh4clAa3hlwlTaB4VAY/getChatMember

// 7350492017:AAGdqqLFW3Jn3Kefuv8jQ7wJcQjsmbJVYho

import supabase from "@/db/supabase";
import { NextResponse } from "next/server";

interface TgApiResponse {
  ok: boolean;
  result?: {
    user: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    status: "left" | "kicked" | "creator" | "member" | "administrator";
    is_anonymous?: boolean;
  };
  eror_code?: number;
  description?: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }
  const body = {
    chat_id: "@asjfiuwqhdiuqnjdbqks",
    user_id: id,
  };

  const response = await fetch(
    "https://api.telegram.org/bot7350492017:AAGdqqLFW3Jn3Kefuv8jQ7wJcQjsmbJVYho/getChatMember",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const tgApiResponse: TgApiResponse = await response.json();
  console.log(tgApiResponse);
  if (
    tgApiResponse.ok &&
    tgApiResponse.result?.status !== "left" &&
    tgApiResponse.result?.status !== "kicked"
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

    const { data: updatedUser, error: userUpdateError } = await supabase
      .from("users")
      .update({
        scores: user.scores + 20000,
      })
      .eq("id", id);

    return NextResponse.json({ ok: true, scores: user.scores + 20000 });
  }

  return Response.json({ ok: false });
}
