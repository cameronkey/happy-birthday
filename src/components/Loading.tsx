import React, { useState, useEffect, useCallback } from 'react';

const Loading = () => {
  const [loadingText, setLoadingText] = useState('A surprise is arriving');
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "💡 This works best with sound enabled!",
    "📱 On mobile? Use touch gestures for the best experience",
    "🎵 Each interaction has delightful sound effects",
    "✨ Look for subtle animations and hover effects"
  ];

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    const tipsInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
      clearInterval(tipsInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center animate-pulse px-4">
        <div className="inline-block animate-spin text-4xl sm:text-5xl md:text-6xl mb-6">🎁</div>
        <p className="text-white text-lg sm:text-xl md:text-2xl font-bold min-h-[2rem]">
          {loadingText}{dots}
        </p>
        
        {/* Enhanced progress bar */}
        <div className="w-48 sm:w-56 md:w-64 h-3 bg-white/20 rounded-full mt-6 mx-auto overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {/* Loading tips */}
        <div className="mt-8 h-12 flex items-center justify-center">
          <p className="text-white/80 text-sm sm:text-base transition-all duration-500 animate-fade-in">
            {tips[currentTip]}
          </p>
        </div>
        
        {/* Percentage indicator */}
        <div className="mt-2 text-white/60 text-sm">
          {Math.round(Math.min(progress, 100))}% complete
        </div>
      </div>
    </div>
  );
};

export default Loading;