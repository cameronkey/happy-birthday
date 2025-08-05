import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import Loading from './components/Loading';
import Envelope from './components/Envelope';
import Card from './components/Card';
import Ticket from './components/Ticket';
import Tutorial from './components/Tutorial';
import ProgressIndicator from './components/ProgressIndicator';

type Stage = 'loading' | 'tutorial' | 'envelope-drop' | 'envelope-hover' | 'card-3d' | 'ticket-view' | 'final';

function App() {
  const [stage, setStage] = useState<Stage>('loading');
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [cardIsOpen, setCardIsOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());

  // Sound effects with Howler.js for better audio support
  const sounds = {
    open: new Howl({ src: ['/sounds/open.mp3'], volume: 0.3 }),
    drag: new Howl({ src: ['/sounds/drag.mp3'], volume: 0.2 }),
    success: new Howl({ src: ['/sounds/success.mp3'], volume: 0.4 }),
    click: new Howl({ src: ['/sounds/click.mp3'], volume: 0.3 }),
  };

  // Initialize audio on first user interaction
  const playSound = (soundName: keyof typeof sounds) => {
    if (soundEnabled && hasInteracted) {
      try {
        sounds[soundName].play();
      } catch (error) {
        // Audio not supported, continue silently
      }
    }
  };

  const markStageComplete = (stageName: string) => {
    setCompletedStages(prev => new Set([...prev, stageName]));
  };

  const enableUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      // Initialize audio context on first interaction
      Object.values(sounds).forEach(sound => sound.load());
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user wants tutorial
      const skipTutorial = localStorage.getItem('skipBirthdayTutorial') === 'true';
      if (skipTutorial) {
        setStage('envelope-drop');
      } else {
        setStage('tutorial');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTutorialComplete = (skip: boolean) => {
    if (skip) {
      localStorage.setItem('skipBirthdayTutorial', 'true');
    }
    setStage('envelope-drop');
    enableUserInteraction();
  };

  const handleEnvelopeHover = () => {
    if (stage === 'envelope-drop' || stage === 'tutorial') {
      enableUserInteraction();
      setStage('envelope-hover');
      setEnvelopeOpened(true);
      playSound('open');
      markStageComplete('envelope-opened');
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (stage === 'envelope-hover') {
      enableUserInteraction();
      setIsDragging(true);
      playSound('drag');
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
      playSound('success');
      markStageComplete('card-revealed');
    }
  };

  const handleDragEnd = () => {
    if (isDragging && dragProgress < 0.8) {
      setDragProgress(0);
      setIsDragging(false);
    }
  };

  const handleCardClick = () => {
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    enableUserInteraction();
    setCardIsOpen(!cardIsOpen);
    playSound('click');
    if (!cardIsOpen) {
      markStageComplete('card-opened');
    }
  }

  const handleTicketClick = () => {
    if (stage === 'card-3d') {
      // Add haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 25, 50]);
      }
      enableUserInteraction();
      setStage('ticket-view');
      playSound('success');
      markStageComplete('ticket-found');
    }
  };

  const handleReturnToCard = () => {
    setStage('card-3d');
    playSound('click');
  }

  const downloadGift = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Create a simple gift certificate
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve();
          return;
        }

        canvas.width = 800;
        canvas.height = 600;

        // Background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, 800, 600);

        // Border
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 760, 560);

        // Title
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎁 Birthday Gift Certificate 🎁', 400, 120);

        // Message
        ctx.font = '24px Arial';
        ctx.fillText('Happy Birthday!', 400, 200);
        ctx.fillText('This certificate entitles you to:', 400, 260);
        ctx.fillText('One amazing birthday surprise!', 400, 320);

        // Date
        ctx.font = '18px Arial';
        ctx.fillText(`Valid from: ${new Date().toLocaleDateString()}`, 400, 420);

        // Signature line
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(500, 500);
        ctx.lineTo(700, 500);
        ctx.stroke();
        ctx.fillText('Signature', 600, 520);

        // Download
        const link = document.createElement('a');
        link.download = 'birthday-gift-certificate.png';
        link.href = canvas.toDataURL();
        link.click();
        
        setStage('final');
        markStageComplete('gift-downloaded');
        playSound('success');
        resolve();
      }, 1000); // Simulate processing time
    });
  };

  const getStageProgress = () => {
    const stages = ['envelope-opened', 'card-revealed', 'card-opened', 'ticket-found', 'gift-downloaded'];
    return (completedStages.size / stages.length) * 100;
  };

  const renderContent = () => {
    switch (stage) {
      case 'loading':
        return <Loading />;
      case 'tutorial':
        return <Tutorial onComplete={handleTutorialComplete} />;
      case 'envelope-drop':
      case 'envelope-hover':
        return (
          <Envelope
            stage={stage}
            isDragging={isDragging}
            dragProgress={dragProgress}
            envelopeOpened={envelopeOpened}
            onHover={handleEnvelopeHover}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          />
        );
      case 'card-3d':
        return (
          <Card
            isOpen={cardIsOpen}
            onClick={handleCardClick}
            onTicketClick={handleTicketClick}
          />
        );
      case 'ticket-view':
        return (
          <Ticket
            onReturn={handleReturnToCard}
            onDownload={downloadGift}
          />
        );
      case 'final':
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center text-white">
              <div className="text-8xl mb-8">🎉</div>
              <h1 className="text-4xl font-bold mb-4">Happy Birthday!</h1>
              <p className="text-xl mb-8">Your gift certificate has been downloaded!</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        );
      default:
        return <Loading />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 overflow-hidden relative">
      {/* Settings Panel */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-all"
            aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={() => setShowTutorial(true)}
            className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-all"
            aria-label="Show tutorial"
          >
            ❓
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      {stage !== 'loading' && stage !== 'tutorial' && stage !== 'final' && (
        <ProgressIndicator progress={getStageProgress()} stage={stage} />
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <Tutorial 
          onComplete={() => setShowTutorial(false)} 
          isModal={true}
        />
      )}

      {renderContent()}
    </div>
  );
}

export default App;