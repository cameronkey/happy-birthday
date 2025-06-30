import React, { useState, useEffect, useRef } from 'react';
import { Gift, Download, Heart, Sparkles, Mail } from 'lucide-react';

type Stage = 'loading' | 'envelope-drop' | 'envelope-hover' | 'card-reveal' | 'card-3d' | 'ticket-view' | 'final';

function App() {
  const [stage, setStage] = useState<Stage>('loading');
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  // Initialize audio on first user interaction
  const playSound = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Audio API not supported, continue silently
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('envelope-drop');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnvelopeHover = () => {
    if (stage === 'envelope-drop') {
      setStage('envelope-hover');
      setEnvelopeOpened(true);
      playSound(523, 0.2); // C note
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (stage === 'envelope-hover') {
      setIsDragging(true);
      playSound(659, 0.1); // E note
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const progress = Math.min(Math.max((clientY - 200) / 200, 0), 1);
    setDragProgress(progress);
    
    if (progress > 0.8) {
      setStage('card-reveal');
      setIsDragging(false);
      playSound(783, 0.3); // G note
    }
  };

  const handleDragEnd = () => {
    if (isDragging && dragProgress < 0.8) {
      setDragProgress(0);
      setIsDragging(false);
    }
  };

  const handleCardClick = () => {
    if (stage === 'card-reveal') {
      setStage('card-3d');
      setCardFlipped(true);
      playSound(1047, 0.4); // High C
    } else if (stage === 'card-3d') {
      setCardFlipped(!cardFlipped);
      playSound(1047, 0.4); // High C
    }
  };

  const handleTicketClick = () => {
    if (stage === 'card-3d') {
      setStage('ticket-view');
      playSound(1319, 0.5); // E high
    }
  };

  const downloadGift = () => {
    // Create a simple gift certificate
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#fbbf24');
    gradient.addColorStop(1, '#f97316');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎁 BIRTHDAY SURPRISE! 🎁', 400, 200);
    
    ctx.font = '32px Arial';
    ctx.fillText('This certificate entitles you to:', 400, 280);
    ctx.fillText('One Amazing Birthday Celebration!', 400, 340);
    
    ctx.font = '24px Arial';
    ctx.fillText('Valid for: Unlimited happiness', 400, 420);
    ctx.fillText('Expires: Never!', 400, 460);

    // Download
    const link = document.createElement('a');
    link.download = 'birthday-surprise.png';
    link.href = canvas.toDataURL();
    link.click();
    
    setStage('final');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 overflow-hidden relative">
      {/* Loading Stage */}
      {stage === 'loading' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center animate-pulse">
            <div className="inline-block animate-spin text-6xl mb-4">🎁</div>
            <p className="text-white text-2xl font-bold">A surprise is arriving...</p>
            <div className="w-64 h-2 bg-white/20 rounded-full mt-4 mx-auto overflow-hidden">
              <div className="h-full bg-white rounded-full animate-[loading_2s_ease-in-out]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Envelope Stages */}
      {(stage === 'envelope-drop' || stage === 'envelope-hover') && (
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
      )}

      {/* Card Reveal Stage - Transition from envelope to 3D card */}
      {stage === 'card-reveal' && (
        <div className="flex items-center justify-center min-h-screen relative">
          <div className="text-center mb-8 absolute top-20 animate-fade-in">
            <p className="text-white text-xl mb-2">🎉 You pulled out the card!</p>
            <p className="text-white/80 text-sm">Click on it to open and explore</p>
          </div>

          <div 
            className="w-96 h-64 bg-white rounded-xl shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 animate-[card-appear_1s_ease-out]"
            onClick={handleCardClick}
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-xl p-8 flex flex-col justify-center items-center text-white">
              <Sparkles className="w-16 h-16 mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold mb-2">Happy Birthday!</h2>
              <p className="text-center text-lg opacity-90">Click to open your card!</p>
            </div>
          </div>
        </div>
      )}

      {/* 3D Card Stage */}
      {(stage === 'card-3d' || stage === 'ticket-view') && (
        <div className="flex items-center justify-center min-h-screen relative perspective-1000">
          {stage === 'card-3d' && (
            <div className="text-center mb-8 absolute top-20 animate-fade-in">
              <p className="text-white text-xl mb-2">🔍 Explore your birthday card!</p>
              <p className="text-white/80 text-sm">Look for the special ticket inside</p>
            </div>
          )}

          <div 
            className={`relative w-96 h-64 transform-gpu transition-all duration-1000 animate-[card-appear_1s_ease-out] ${
              cardFlipped ? 'scale-110' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
            onClick={handleCardClick}
          >
            {/* Card Front */}
            <div className={`absolute inset-0 w-full h-full rounded-xl shadow-2xl backface-hidden transition-transform duration-700 ${
              cardFlipped ? 'rotateY-180' : ''
            }`}>
              <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-xl p-8 flex flex-col justify-center items-center text-white">
                <Sparkles className="w-16 h-16 mb-4 animate-pulse" />
                <h2 className="text-3xl font-bold mb-2">Happy Birthday!</h2>
                <p className="text-center text-lg opacity-90">Hope your special day is wonderful!</p>
              </div>
            </div>

            {/* Card Back */}
            <div className={`absolute inset-0 w-full h-full rounded-xl shadow-2xl backface-hidden transition-transform duration-700 ${
              cardFlipped ? '' : 'rotateY-180'
            }`}>
              <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-8 flex flex-col justify-center items-center text-white relative">
                <h3 className="text-2xl font-bold mb-4">Inside Your Card</h3>
                <p className="text-center mb-6">You've found a special surprise!</p>
                
                {/* Gift Ticket */}
                <div 
                  className="bg-white text-gray-800 rounded-lg p-4 shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 animate-pulse border-2 border-dashed border-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTicketClick();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Gift className="w-6 h-6 text-orange-500" />
                    <span className="font-bold">🎫 SURPRISE TICKET</span>
                  </div>
                  <p className="text-sm mt-1 text-gray-600">Click to reveal your gift!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket View Stage */}
      {stage === 'ticket-view' && (
        <div className="flex items-center justify-center min-h-screen relative">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform animate-[ticket-zoom_0.5s_ease-out]">
            <div className="text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Birthday Gift!</h2>
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-2">🎉 Special Birthday Surprise</h3>
                <p className="text-sm opacity-90">This certificate is good for one amazing birthday celebration filled with joy, laughter, and unforgettable memories!</p>
              </div>
              
              <button 
                onClick={downloadGift}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Download className="w-5 h-5" />
                Download Your Gift!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Stage */}
      {stage === 'final' && (
        <div className="flex items-center justify-center min-h-screen relative">
          <div className="text-center max-w-md mx-4">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Gift Downloaded!</h2>
            <p className="text-white/90 text-lg mb-8">Hope you enjoyed your birthday surprise!</p>
            
            <button 
              onClick={() => {
                setStage('loading');
                setDragProgress(0);
                setCardFlipped(false);
                setIsDragging(false);
                setEnvelopeOpened(false);
              }}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              💌 Create Another Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;