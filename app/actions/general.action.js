'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ----------------- GET INTERVIEWS BY USER ID -----------------
export async function getInterviewByUserId(userId,limit=6) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("user_id", userId)
    .limit(limit)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching interviews:", error.message);
    return null;
  }

  return data;
}

// ----------------- GET LATEST INTERVIEWS (EXCEPT USER) -----------------
export async function getLatestInterviews({ userId, limit = 20 }) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("interviews")
    .select("*")
    .eq("finalized", true)
    .neq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data;
}

// ----------------- GET INTERVIEW BY ID -----------------
export async function getInterviewById(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", id)
    .single(); // ensures only one row is returned

  if (error) {
    console.error("Error fetching interview:", error.message);
    return null;
  }

  return data;
}
