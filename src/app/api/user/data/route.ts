import supabase from "@/db/supabase"

export async function GET(req: Request) {
    try {
        // Получение id пользователя из запроса
        // const { searchParams } = new URL(req.url);
        // const id = searchParams.get('id');

        // if (!id) {
        //     return Response.json({ error: "Missing user ID" }, { status: 400 });
        // }

        // Получение данных пользователя из базы данных
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', 707837995)
            .single();

        if (fetchError) {
            console.error("Failed to fetch user:", fetchError);
            return Response.json({ error: "Failed to fetch user" }, { status: 500 });
        }

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        return Response.json({ user }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
