"use server";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabse";


export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const { data: user, error: userError } = await supabase
    .schema("next_auth")
    .from("users")
    .select("name, email, image")
    .eq("id", userId) 
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  // 2. Calculate Weeks Done
  const { data: activities } = await supabase
    .from("activities")
    .select("week_number, year_number")
    .eq("user_id", userId);

  const uniqueWeeks = new Set(
    activities?.map((a) => `${a.year_number}-${a.week_number}`)
  );
  
  return {
    name: user.name || "Intern",
    email: user.email,
    image: user.image,
    weeksDone: uniqueWeeks.size,
  };
}

export async function updateUserName(newName: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const { error } = await supabase
    .schema("next_auth")
    .from("users")
    .update({ name: newName })
    .eq("id", session.user.id);

  if (error) return { error: "Failed to update name" };

  revalidatePath("/profile");
  return { success: true };
}