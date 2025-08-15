// app/actions/auth.js - Server Actions for Authentication
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signUp(formData) {
  const supabase = await createClient()

  // Get form data
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
      data: {
        username: formData.get('username'), // This will be saved in user metadata
        full_name: formData.get('username')
      }
    }
  }

  try {
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp(data)

    if (authError) {
      console.error('Auth signup error:', authError)
      return { error: authError.message }
    }

    if (authData.user) {
      // Insert user data into your custom users table
      const { error: dbError } = await supabase
        .from('users') // Make sure this table exists
        .insert([
          {
            id: authData.user.id, // Use the auth user ID
            email: authData.user.email,
            username: formData.get('username'),
            created_at: new Date().toISOString(),
          }
        ])

      if (dbError) {
        console.error('Database insert error:', dbError)
        // You might want to delete the auth user if database insert fails
        // await supabase.auth.admin.deleteUser(authData.user.id)
        return { error: 'Failed to create user profile. Please try again.' }
      }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard') // or wherever you want to redirect after signup

  } catch (error) {
    console.error('Unexpected signup error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function signIn(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  try {
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.error('Sign in error:', error)
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')

  } catch (error) {
    console.error('Unexpected sign in error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
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
