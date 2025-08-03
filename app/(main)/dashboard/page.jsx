// app/dashboard/page.js
"use client";
import React from 'react';
import WelcomeContainer from './_components/WelcomeContainer';
import YourInterviews from './_components/YourInterviews';

function Dashboard() {
  return (
    <div className='dashboard'>
      <WelcomeContainer /> 
      {/* <h2 className='my-3 font-bold text-2xl'>Dashboard</h2> */}
      <YourInterviews />
    </div>
  );
}

export default Dashboard;