import supabase from "@/db/supabase";

export default async function increase_max_energy(userId: string, increment: number) {
    try {
        // Логирование user для отладки
        console.log("User ID:", userId);

        // Получаем текущую максимальную энергию пользователя
        const { data: user, error } = await supabase
            .from("users")
            .select("maxenergy")
            .eq("id", userId)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        if (!user) {
            throw new Error("User not found");
        }

        const currentMaxEnergy: number = user.maxenergy;

        // Рассчитываем новое значение максимальной энергии
        const newMaxEnergy: number = currentMaxEnergy + increment;

        // Обновляем значение максимальной энергии пользователя
        const { error: updateError } = await supabase
            .from("users")
            .update({ maxenergy: newMaxEnergy })
            .eq("id", userId);

        if (updateError) {
            throw new Error(updateError.message);
        }

        console.log("Max energy updated successfully");
        return newMaxEnergy;
    } catch (error) {
        console.error("Error updating max energy:", error);
    }
}
