import React from 'react';
import { Heart, Mail } from 'lucide-react';

type EnvelopeProps = {
  stage: string;
  envelopeOpened: boolean;
  isDragging: boolean;
  dragProgress: number;
  handleEnvelopeHover: () => void;
  handleDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
  handleDragMove: (e: React.MouseEvent | React.TouchEvent) => void;
  handleDragEnd: () => void;
};

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
  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {stage === 'envelope-drop' && (
        <div className="text-center mb-8 absolute top-20 animate-fade-in">
          <p className="text-white text-xl mb-2">👉 Hover over the envelope to open it!</p>
          <p className="text-white/80 text-sm">(On mobile: tap and hold)</p>
        </div>
      )}
      
      {stage === 'envelope-hover' && (
        <div className="text-center mb-8 absolute top-20 animate-bounce">
          <p className="text-white text-xl mb-2">⬇️ Pull the card out!</p>
          <p className="text-white/80 text-sm">Drag it down to reveal your surprise</p>
        </div>
      )}

      {/* Envelope Container */}
      <div 
        className={`relative transition-all duration-1000 ${
          stage === 'envelope-drop' ? 'animate-[envelope-drop_1.5s_ease-out]' : ''
        } ${stage === 'envelope-hover' ? 'scale-105' : ''}`}
        onMouseEnter={handleEnvelopeHover}
        onTouchStart={handleEnvelopeHover}
      >
        {/* Main Envelope Body - md classes double the size on desktop */}
        <div className="relative w-80 md:w-[40rem] h-56 md:h-[28rem] bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-2xl overflow-hidden">
          
          {/* Envelope Seal/Wax */}
          <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 md:w-32 h-16 md:h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg z-20 transition-all duration-700 ${
            envelopeOpened ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}>
            <div className="absolute inset-2 md:inset-4 bg-red-400 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 md:w-12 md:h-12 text-white" />
            </div>
          </div>

          {/* Side Flap */}
          <div className={`absolute top-0 right-0 w-40 md:w-80 h-56 md:h-[28rem] bg-gradient-to-bl from-amber-300 to-orange-400 transform-gpu transition-all duration-1000 origin-right z-10 ${
            envelopeOpened ? 'rotate-y-120 translate-x-8 md:translate-x-16' : 'rotate-y-0'
          }`}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)',
            transformStyle: 'preserve-3d'
          }}>
            <Mail className="absolute top-4 right-4 md:top-8 md:right-8 text-orange-600 w-6 h-6 md:w-12 md:h-12" />
          </div>

          {/* Card inside envelope - only visible when envelope opens */}
          {envelopeOpened && (
            <div 
              className={`absolute top-8 md:top-16 left-8 md:left-16 w-64 md:w-[32rem] h-40 md:h-80 bg-white rounded-lg shadow-lg transform transition-all duration-500 cursor-grab z-30 ${
                isDragging ? 'cursor-grabbing' : ''
              } ${stage === 'envelope-hover' ? 'animate-[card-peek_0.8s_ease-out]' : ''}`}
              style={{
                transform: `translateY(${dragProgress * 200}px) rotateX(${dragProgress * 15}deg)`,
                boxShadow: `0 ${20 + dragProgress * 20}px ${40 + dragProgress * 20}px rgba(0,0,0,0.3)`
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="p-6 md:p-12 h-full flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg border-2 border-pink-200">
                <Heart className="text-pink-500 w-12 h-12 md:w-24 md:h-24 mb-2 md:mb-4 animate-pulse" />
                <p className="text-purple-800 font-bold text-center text-lg md:text-3xl">Happy Birthday!</p>
                <p className="text-purple-600 text-sm md:text-lg text-center mt-1 md:mt-2">Drag me out!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Envelope; 