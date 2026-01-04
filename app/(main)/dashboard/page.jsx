// app/dashboard/page.js
import React from 'react';
import WelcomeContainer from './_components/WelcomeContainer';
import YourInterviews from './_components/YourInterviews';

function Dashboard() {
  return (
    <div className='dashboard'>
      <WelcomeContainer /> 
      <YourInterviews />
    </div>
  );
}

export default Dashboard;