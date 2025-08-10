import React from 'react'
import Agent from './_components/Agent'

function page() {
  return (
    <>
    <h2 className='text-2xl font-bold text-gray-800'>Interview Generation</h2>
    <Agent userName="John Doe" userId="user1" type="generate" />
    </>
  )
}

export default page