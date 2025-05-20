import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r bg-[a3a1fd]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-300 opacity-75"></div>
        <div className="absolute inset-0 rounded-full border-4 border-white"></div>
      </div>
    </div>
  );
};

export default Loading;