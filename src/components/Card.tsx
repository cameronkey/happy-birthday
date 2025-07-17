import React, { useState, useRef, useEffect } from 'react';
import './Card.css';

type CardProps = {
  isOpened: boolean;
  onCardClick: () => void;
  onTicketClick: () => void;
};

const Card: React.FC<CardProps> = ({ isOpened, onCardClick, onTicketClick }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = videoRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleTicketClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from closing when ticket is clicked
    
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    onTicketClick();
  };

  const handleCardClick = () => {
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    onCardClick();
  };
  
  return (
    <div 
      className={`birthdayCard ${isOpened ? 'is-opened' : ''}`}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label="Birthday card - click to open"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="cardFront relative overflow-hidden">
        <div className="relative z-10 p-4">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
          >
          </svg>
        </div>
        
        {/* Video with lazy loading and fallback */}
        <div 
          ref={videoRef}
          className="absolute bottom-0 left-0 w-full h-32 sm:h-40 md:h-48 lg:h-56"
          style={{ maskImage: 'linear-gradient(to top, black 10%, transparent 100%)' }}
        >
          {!videoLoaded && !videoError && (
            <div className="w-full h-full bg-gradient-to-t from-pink-200 to-transparent animate-pulse flex items-center justify-center">
              <div className="text-pink-400 text-2xl">🦝</div>
            </div>
          )}
          
          {videoError && (
            <div className="w-full h-full bg-gradient-to-t from-pink-200 to-transparent flex items-center justify-center">
              <div className="text-pink-600 text-4xl animate-bounce">🦝✨</div>
            </div>
          )}
          
          {isInView && (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadedData={() => setVideoLoaded(true)}
              onError={() => setVideoError(true)}
            >
              <source src="/videos/racoon-video.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      </div>
      <div className="cardInside">
        <div 
          className="golden-ticket overflow-hidden absolute bottom-4 right-4 w-1/2 p-2 text-black text-center rounded-lg cursor-pointer transition-all"
          style={{
            background: 'linear-gradient(to right, #d19e1d, #ffd86e, #e3a812)'
          }}
          onClick={handleTicketClick}
          tabIndex={0}
          role="button"
          aria-label="Golden surprise ticket - click to reveal surprise"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTicketClick(e as any);
            }
          }}
        >
          <p className="font-bold text-sm">Surprise Ticket</p>
        </div>
      </div>
    </div>
  );
};

export default Card;