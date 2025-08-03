import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function WelcomeContainer() {
  return (
    <>
      <section className='card-cta flex items-center justify-between gap-6 p-6'>
        <div className='flex flex-col gap-3 w-full'>
          <h2 className='text-2xl font-bold leading-snug text-gray-900'>
            Get Interview-Ready <br />
            with <span className='text-[#4F39F6]'>AI Powered Practice</span> <br />
            and Feedback
          </h2>
          <p className='text-sm text-gray-600 leading-relaxed'>
            Practice on real interview questions and receive instant feedback to improve your skills and confidence.
          </p>
          <Button 
            asChild 
            className="bg-primary text-white hover:bg-primary-dark transition-all duration-300 ease-in-out px-5 py-2 rounded-lg shadow-md hover:shadow-lg max-sm:w-full text-sm font-medium w-4/5"
          >
            <Link href="/interview">🚀 Start an Interview</Link>
          </Button>
        </div>
        <Image 
          src="/robo.png" 
          alt="robot" 
          width={900} 
          height={400} 
          className='max-sm:hidden' 
        />
      </section>
    </>
  )
}

export default WelcomeContainer
