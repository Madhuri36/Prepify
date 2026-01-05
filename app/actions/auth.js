// app/actions/auth.js - Server Actions for Authentication
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'


// app/actions/auth.js

export async function signUp(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: username,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { error: dbError } = await supabase
      .from("users")
      .upsert(
        {
          id: data.user.id,
          email: data.user.email,
          username,
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (dbError) {
      console.error("User profile upsert failed:", dbError.message);
    }
  }

  // Force session
  const { error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    return { error: signInError.message };
  }

  return { success: true };
}



// app/actions/auth.js
export async function signIn(formData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}


// ----------------- SIGN OUT -----------------
export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

// ----------------- GET CURRENT USER -----------------
export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Server action - Error fetching user:', error.message)
    return { user: null, error: error.message }
  }
  return { user, error: null }
}


