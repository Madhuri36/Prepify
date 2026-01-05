// app/actions/auth.js - Server Actions for Authentication
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'


// app/actions/auth.js

export async function signUp(formData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
      data: {
        username: formData.get('username'),
        full_name: formData.get('username'),
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          username: formData.get('username'),
          created_at: new Date().toISOString(),
        },
      ]);

    if (dbError) {
      return { error: 'Failed to create user profile.' };
    }
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


