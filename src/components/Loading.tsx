import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [loadingText, setLoadingText] = useState('A surprise is arriving');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center animate-pulse px-4">
        <div className="inline-block animate-spin text-4xl sm:text-5xl md:text-6xl mb-4">🎁</div>
        <p className="text-white text-lg sm:text-xl md:text-2xl font-bold min-h-[2rem]">
          {loadingText}{dots}
        </p>
        <div className="w-48 sm:w-56 md:w-64 h-2 bg-white/20 rounded-full mt-4 mx-auto overflow-hidden">
          <div className="h-full bg-white rounded-full animate-[loading_2s_ease-in-out]"></div>
        </div>
        
        {/* Skeleton elements for smoother transition */}
        <div className="mt-8 space-y-3 opacity-30">
          <div className="h-4 bg-white/20 rounded w-3/4 mx-auto animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded w-1/2 mx-auto animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;