import React from 'react'
import Agent from './_components/Agent'
import { getUser } from '@/app/actions/auth'

const page = async () => {
  const { user } = await getUser(); // Destructure to get user from the returned object
  
  // Get username from user metadata or fallback to email prefix
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Guest';
  
  return (
    <>
      <h2 className='text-2xl font-bold text-gray-800 ml-4'>Create an Interview</h2>
      <Agent userName={userName} userId={user?.id} type="generate" />
    </>
  )
}

export default page