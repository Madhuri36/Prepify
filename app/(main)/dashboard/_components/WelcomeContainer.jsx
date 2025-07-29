"use client";
import React, { useEffect, useState } from 'react';
import { getUser } from '@/app/actions/auth';
function WelcomeContainer() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      const { user, error } = await getUser();

      if (error) {
        console.error('WelcomeContainer - Error fetching user:', error.message);
        setLoading(false);
        setUsername('Guest'); 
        return;
      }

      if (user) {
        console.log('Fetched user object in WelcomeContainer:', user);
        console.log('User metadata in WelcomeContainer:', user.user_metadata);
        setUsername(user.user_metadata?.username || user.email);
      } else {
        console.log('No user object returned from server action in WelcomeContainer.');
        setUsername('Guest');
      }
      setLoading(false);
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>   </h1>
      </div>
    );
  }

  return (
    <div className='bg-white p-5 rounded-2xl w-full'>
      <h2 className='text-lg font-bold'>Welcome Back, {username}!</h2>
      <h2 className='text-gray-500'>AI-Powered Mock Interviews</h2>
    </div>
  );
}

export default WelcomeContainer;