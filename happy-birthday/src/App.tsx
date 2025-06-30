import React, { useState, useEffect } from 'react';
import Loading from './components/Loading';
import Envelope from './components/Envelope';
import Card from './components/Card';
import Ticket from './components/Ticket';
import { Sparkles } from 'lucide-react';

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

  const renderContent = () => {
    switch (stage) {
      case 'loading':
        return <Loading />;
      case 'envelope-drop':
      case 'envelope-hover':
        return (
          <Envelope
            stage={stage}
            envelopeOpened={envelopeOpened}
            isDragging={isDragging}
            dragProgress={dragProgress}
            handleEnvelopeHover={handleEnvelopeHover}
            handleDragStart={handleDragStart}
            handleDragMove={handleDragMove}
            handleDragEnd={handleDragEnd}
          />
        );
      case 'card-reveal':
        return (
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
        )
      case 'card-3d':
        return (
          <div className="flex items-center justify-center min-h-screen">
            <Card handleTicketClick={handleTicketClick} />
          </div>
        );
      case 'ticket-view':
        return <Ticket downloadGift={downloadGift} stage={stage} />;
      case 'final':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Enjoy Your Surprise!</h2>
            <p className="text-xl">We hope you have a fantastic birthday.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 overflow-hidden relative">
      {renderContent()}
    </div>
  );
}

export default App;