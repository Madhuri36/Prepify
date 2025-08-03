"use client";
import { useEffect, useState } from 'react';
import { getUser } from '@/app/actions/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { user, error } = await getUser();

        if (error) {
          console.error('useAuth - Error fetching user:', error.message);
          setError(error);
          setLoading(false);
          return;
        }

        if (user) {
          console.log('Fetched user object in useAuth:', user);
          console.log('User metadata in useAuth:', user.user_metadata);
          setUser(user);
        } else {
          console.log('No user object returned from server action in useAuth.');
        }
      } catch (err) {
        console.error('useAuth - Unexpected error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const getUsername = () => {
    if (!user) return 'Guest';
    return user.user_metadata?.username || user.email?.split('@')[0] || 'User';
  };

  const getEmail = () => {
    if (!user) return 'guest@example.com';
    return user.email || 'No email';
  };

  return { 
    user, 
    loading, 
    error, 
    getUsername, 
    getEmail,
    isAuthenticated: !!user 
  };
}