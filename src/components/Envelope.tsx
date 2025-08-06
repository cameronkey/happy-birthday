import React, { useState, useRef, useCallback } from 'react';
import { Heart, Mail, ArrowDown } from 'lucide-react';

interface EnvelopeProps {
  stage: string;
  envelopeOpened: boolean;
  isDragging: boolean;
  dragProgress: number;
  handleEnvelopeHover: () => void;
  handleDragStart: (e: any) => void;
  handleDragMove: (e: any) => void;
  handleDragEnd: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({
  stage,
  envelopeOpened,
  isDragging,
  dragProgress,
  handleEnvelopeHover,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
}) => {
  const [touchStartY, setTouchStartY] = useState(0);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    handleDragStart(e);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY;
    
    // Create a synthetic mouse event for consistency
    const syntheticEvent = {
      ...e,
      clientY: touchStartY + deltaY,
    } as any;
    
    handleDragMove(syntheticEvent);
  }, [touchStartY, handleDragMove]);

  const handleSealInteraction = () => {
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    handleEnvelopeHover();
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Enhanced contextual hints */}
      {stage === 'envelope-drop' && (
        <div className="text-center mb-8 absolute top-12 sm:top-16 md:top-20 animate-fade-in px-4 z-30">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="text-white text-xl sm:text-2xl md:text-3xl mb-2 font-semibold" style={{ fontFamily: 'Dancing Script, cursive' }}>
              👇 Hover over the red seal to open!
            </p>
            <p className="text-white/80 text-sm sm:text-base md:text-lg">
              (On mobile: tap the seal)
            </p>
            <div className="mt-2 animate-pulse">
              <span className="text-yellow-300">✨ Look for the glowing effect</span>
            </div>
          </div>
        </div>
      )}
      
      {stage === 'envelope-hover' && (
        <div className="text-center mb-8 absolute top-12 sm:top-16 md:top-20 animate-bounce px-4 z-30">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="text-white text-xl sm:text-2xl md:text-3xl mb-2 font-semibold" style={{ fontFamily: 'Dancing Script, cursive' }}>
              ⬇️ Pull the card out!
            </p>
            <p className="text-white/80 text-sm sm:text-base md:text-lg">
              Drag it down to reveal your surprise
            </p>
            <div className="mt-2">
              <span className="text-green-300">🎯 Drag progress: {Math.round(dragProgress * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Envelope Container */}
      <div 
        className={`relative transition-all duration-1000 ${
          stage === 'envelope-drop' ? 'animate-[envelope-drop_1.5s_ease-out]' : ''
        } ${stage === 'envelope-hover' ? 'scale-105' : ''}`}
      >
        {/* Main Envelope Body - Responsive sizing */}
        <div className="relative w-72 xs:w-80 sm:w-96 md:w-[32rem] lg:w-[40rem] h-48 xs:h-56 sm:h-64 md:h-80 lg:h-[28rem] bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-2xl overflow-hidden">
          
          {/* Envelope Seal/Wax */}
          <div 
            className={`absolute top-2 sm:top-3 md:top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 xs:w-16 sm:w-20 md:w-28 lg:w-32 h-12 xs:h-16 sm:h-20 md:h-28 lg:h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg z-20 transition-all duration-700 cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-300 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/50 ${
              envelopeOpened ? 'scale-0 opacity-0' : 'scale-100 opacity-100 animate-pulse'
            }`}
            onMouseEnter={handleSealInteraction}
            onTouchStart={handleSealInteraction}
            onClick={handleSealInteraction}
            tabIndex={0}
            role="button"
            aria-label="Envelope seal - interact to open envelope"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSealInteraction();
              }
            }}
          >
            <div className="absolute inset-1 xs:inset-2 sm:inset-3 md:inset-4 bg-red-400 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors">
              <ArrowDown className="w-4 h-4 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white animate-pulse" />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-ping"></div>
            </div>
          </div>

          {/* Side Flap */}
          <div className={`absolute top-0 right-0 w-36 xs:w-40 sm:w-48 md:w-64 lg:w-80 h-48 xs:h-56 sm:h-64 md:h-80 lg:h-[28rem] bg-gradient-to-bl from-amber-300 to-orange-400 transform-gpu transition-all duration-1000 origin-right z-10 ${
            envelopeOpened ? 'rotate-y-120 translate-x-8 md:translate-x-16' : 'rotate-y-0'
          }`}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)',
            transformStyle: 'preserve-3d'
          }}>
            <Mail className="absolute top-2 right-2 xs:top-4 xs:right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 text-orange-600 w-4 h-4 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </div>

          {/* Card inside envelope - only visible when envelope opens */}
          {envelopeOpened && (
            <div 
              ref={dragRef}
              className={`absolute top-6 xs:top-8 sm:top-10 md:top-16 left-6 xs:left-8 sm:left-12 md:left-16 w-60 xs:w-64 sm:w-72 md:w-96 lg:w-[32rem] h-32 xs:h-40 sm:h-48 md:h-64 lg:h-80 bg-white rounded-lg shadow-lg transform transition-all duration-500 cursor-grab z-30 focus:outline-none focus:ring-4 focus:ring-purple-300 hover:shadow-2xl ${
                isDragging ? 'cursor-grabbing' : ''
              } ${stage === 'envelope-hover' ? 'animate-[card-peek_0.8s_ease-out]' : ''}`}
              style={{
                transform: `translateY(${dragProgress * 200}px) rotateX(${dragProgress * 15}deg) scale(${1 + dragProgress * 0.1})`,
                boxShadow: `0 ${20 + dragProgress * 20}px ${40 + dragProgress * 20}px rgba(0,0,0,${0.3 + dragProgress * 0.2})`
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
              tabIndex={0}
              role="button"
              aria-label="Birthday card - drag down to pull out"
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  // Simulate drag progress for keyboard users
                  const syntheticEvent = { clientY: 400 } as any;
                  handleDragMove(syntheticEvent);
                }
              }}
            >
              <div className="p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12 h-full flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg border-2 border-pink-200">
                <Heart className="text-pink-500 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 mb-1 xs:mb-2 sm:mb-3 md:mb-4 animate-pulse" />
                <p className="text-purple-800 font-bold text-center text-base xs:text-lg sm:text-xl md:text-3xl lg:text-4xl" style={{ fontFamily: 'Dancing Script, cursive' }}>Happy Birthday!</p>
                <p className="text-purple-600 text-sm xs:text-base sm:text-lg md:text-xl text-center mt-1 md:mt-2" style={{ fontFamily: 'Dancing Script, cursive' }}>
                  {isDragging ? `${Math.round(dragProgress * 100)}% pulled out!` : 'Drag me out!'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Envelope;