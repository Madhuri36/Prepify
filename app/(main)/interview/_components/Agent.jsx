"use client";
import React, { useState } from 'react';
import { MessageCircle, User } from 'lucide-react';

const CALL_STATUS = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  CONNECTING: 'CONNECTING',
  FINISHED: 'FINISHED',
};

function Agent({ userName = "John Doe" }) {
  const [currentCallStatus] = useState(CALL_STATUS.ACTIVE);
  const [isSpeaking] = useState(true);

  const messages = [
    'What\'s your name?',
    'My name is John Doe, nice to meet you!'
  ];
  const lastMsg = messages[messages.length - 1];

  return (
    <div className="mt-4 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-3 py-4">
        {/* Removed max-w-6xl mx-auto wrapper */}

        {/* Video Call Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* AI Interviewer Card */}
          <div className="group relative transition-all duration-500 transform ">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F39F6] to-[#7C3AED] rounded-2xl opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative h-[320px] bg-gradient-to-br from-[#DDDFFF] to-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center bg-[#4F39F6] rounded-full w-20 h-20 sm:w-24 sm:h-24 shadow-xl transition-transform duration-300 group-hover:scale-105">
                    <MessageCircle size={40} className="sm:w-12 sm:h-12 text-[#DDDFFF]" />
                  </div>
                  {isSpeaking && (
                    <div className="absolute inset-0 rounded-full bg-[#4F39F6] animate-ping opacity-20"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800">AI Interviewer</h3>
              </div>
            </div>
          </div>

          {/* User Card */}
          <div className="group relative transition-all duration-500 transform hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F39F6] to-[#7C3AED] rounded-2xl opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative h-[320px] bg-gradient-to-br from-white to-[#DDDFFF] rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center bg-[#4F39F6] rounded-full w-20 h-20 sm:w-24 sm:h-24 shadow-xl transition-transform duration-300 group-hover:scale-105">
                    <User size={40} className="sm:w-12 sm:h-12 text-[#DDDFFF]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{userName}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {messages.length > 0 && (
          <div className="relative mb-8 transition-all duration-500 transform">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4">
                <p className="text-gray-800 text-base leading-relaxed animate-fadeIn">
                  {lastMsg}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center">
          {currentCallStatus !== 'ACTIVE' ? (
            <button className="group relative px-8 py-3 rounded-full font-medium text-base shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 bg-green-500 hover:bg-green-600 text-white hover:shadow-lg">
              <span className="flex items-center">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent mr-2"></div>
                {currentCallStatus === 'INACTIVE' || currentCallStatus === 'FINISHED' ? 'Start Call' : 'Connecting...'}
              </span>
              <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </button>
          ) : (
            <button className="group relative px-8 py-3 rounded-full font-medium text-base shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 bg-red-500 hover:bg-red-600 text-white hover:shadow-lg">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-sm mr-2"></div>
                End Call
              </span>
              <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Agent;
