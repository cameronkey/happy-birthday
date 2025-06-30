import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center animate-pulse">
        <div className="inline-block animate-spin text-6xl mb-4">🎁</div>
        <p className="text-white text-2xl font-bold">A surprise is arriving...</p>
        <div className="w-64 h-2 bg-white/20 rounded-full mt-4 mx-auto overflow-hidden">
          <div className="h-full bg-white rounded-full animate-[loading_2s_ease-in-out]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading; 