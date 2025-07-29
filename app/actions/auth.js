// app/actions/auth.js
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const username = formData.get('username'); 

  const supabase = createClient(); // Remove await here

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

  const supabase = createClient(); // Remove await here

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
  const supabase = createClient(); // Remove await here
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error.message);
    return { error: error.message }; 
  }

  redirect('/auth/login'); 
}