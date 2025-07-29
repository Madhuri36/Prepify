// app/actions/auth.js
'use server';
import { redirect } from 'next/navigation';

export async function signUp(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const username = formData.get('username'); 

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, 
      },
    },
  });

  if (error) {
    console.error('Signup error:', error.message);
    return { error: error.message }; 
  }
  redirect('/dashboard');
}

export async function signIn(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const supabase = await createClient(); 

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return { error: error.message }; 
  }

  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient(); 
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error.message);
    return { error: error.message }; 
  }

  redirect('/auth/login'); 
}

// New server action to get user data
export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Server action - Error fetching user:', error.message);
    return { user: null, error: error.message };
  }
  return { user, error: null };
}

// utils/supabase/server.js (No changes needed here from previous update)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() { 
  const cookieStore = cookies() 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            console.warn('Could not set cookie:', error);
          }
        },
        remove(name, options) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            console.warn('Could not remove cookie:', error);
          }
        },
      },
    }
  )
}
