import React, { useState, useEffect } from 'react';
import Loading from './components/Loading';
import Envelope from './components/Envelope';
import Card from './components/Card';
import Ticket from './components/Ticket';
import Confetti from './components/Confetti';
import { ArrowLeft, MousePointer } from 'lucide-react';

type Stage = 'loading' | 'envelope-drop' | 'envelope-hover' | 'card-3d' | 'ticket-view' | 'final';

function App() {
  const [stage, setStage] = useState<Stage>('loading');
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [cardIsOpen, setCardIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
      setStage('card-3d');
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
    setCardIsOpen(!cardIsOpen);
    playSound(1047, 0.4); // High C
  }

  const handleTicketClick = () => {
    if (stage === 'card-3d') {
      setStage('ticket-view');
      playSound(1319, 0.5); // E high
    }
  };

  const handleReturnToCard = () => {
    setStage('card-3d');
    playSound(783, 0.3); // G note
  }

  const downloadGift = () => {
    // Download the existing birthday surprise image
    const link = document.createElement('a');
    link.download = 'birthday-surprise.png';
    link.href = '/images/birthday-surprise.png';
    link.click();
    
    // Trigger confetti celebration
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Stop confetti after 3 seconds
    
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
      case 'card-3d':
        return (
          <div className="flex items-center justify-center min-h-screen relative">
            {/* Tap to Open Indicator - positioned absolutely above the card */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse z-10">
              <MousePointer className="w-4 h-4" />
              <span>Tap to Open</span>
            </div>
            
            <Card 
              isOpened={cardIsOpen}
              onCardClick={handleCardClick}
              onTicketClick={handleTicketClick} 
            />
          </div>
        );
      case 'ticket-view':
        return <Ticket downloadGift={downloadGift} onReturn={handleReturnToCard} />;
      case 'final':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Enjoy Your Surprise!</h2>
            <p className="text-xl mb-8">I hope you have a fantastic birthday 🖤</p>
            <button
              className="fixed top-4 left-4 md:top-8 md:left-8 bg-white/20 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white/30 transform transition-all duration-300 flex items-center gap-2 z-50"
              onClick={handleReturnToCard}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Card
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 overflow-hidden relative">
      {renderContent()}
      <Confetti isActive={showConfetti} />
    </div>
  );
}

export default App;