import React from 'react'
import Agent from './_components/Agent'
import { getUser } from '@/app/actions/auth'

const page=async()=> {
  const user=await getUser();
  return (
    <>
    <h2 className='text-2xl font-bold text-gray-800 ml-4'>Create an Interview</h2>
    <Agent userName={user?.username} userId={user?.id} type="generate" />
    </>
  )
}

export default page