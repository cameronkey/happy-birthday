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
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Handle animation state to prevent clipping
  useEffect(() => {
    if (isOpened) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600); // Match CSS transition duration
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isOpened]);

  // Pause/play video based on card state
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current.querySelector('video') as HTMLVideoElement;
      if (video) {
        if (isOpened) {
          video.pause();
        } else {
          video.play().catch(() => {
            // Video play failed, ignore silently
          });
        }
      }
    }
  }, [isOpened]);
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
      className={`birthdayCard ${isOpened ? 'is-opened' : ''} hover:scale-105 transition-transform duration-300`}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={isOpened ? "Birthday card - click to close" : "Birthday card - click to open"}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="cardFront relative overflow-hidden">
        <div className={`relative z-10 p-4 transition-opacity duration-300 ${
          isOpened || isAnimating ? 'opacity-0' : 'opacity-100'
        }`}>
          <svg viewBox="0 0 300 180" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="50%" stopColor="#4169E1" />
                <stop offset="100%" stopColor="#87CEEB" />
              </linearGradient>
              <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="3" dy="3" stdDeviation="2" floodColor="#00008B" floodOpacity="0.8"/>
              </filter>
            </defs>
            
            {/* HAPPY text on curved path */}
            <path id="happy-curve" d="M 30,70 Q 150,40 270,70" fill="none" />
            <text 
              fontSize="28" 
              fontFamily="Baloo 2, cursive" 
              fontWeight="800" 
              fill="url(#textGradient)"
              filter="url(#textShadow)"
              textAnchor="middle"
            >
              <textPath href="#happy-curve" startOffset="50%">
                HAPPY
              </textPath>
            </text>
            
            {/* BIRTHDAY text on curved path */}
            <path id="birthday-curve" d="M 20,130 Q 150,100 280,130" fill="none" />
            <text 
              fontSize="24" 
              fontFamily="Baloo 2, cursive" 
              fontWeight="800" 
              fill="url(#textGradient)"
              filter="url(#textShadow)"
              textAnchor="middle"
            >
              <textPath href="#birthday-curve" startOffset="50%">
                BIRTHDAY
              </textPath>
            </text>
            
            {/* Decorative elements */}
            <g opacity="0.7">
              {/* Stars */}
              <path d="M 50,30 L 52,36 L 58,36 L 53,40 L 55,46 L 50,42 L 45,46 L 47,40 L 42,36 L 48,36 Z" fill="#FFD700" />
              <path d="M 250,25 L 252,31 L 258,31 L 253,35 L 255,41 L 250,37 L 245,41 L 247,35 L 242,31 L 248,31 Z" fill="#FFD700" />
              <path d="M 80,160 L 82,166 L 88,166 L 83,170 L 85,176 L 80,172 L 75,176 L 77,170 L 72,166 L 78,166 Z" fill="#FFD700" />
              <path d="M 220,155 L 222,161 L 228,161 L 223,165 L 225,171 L 220,167 L 215,171 L 217,165 L 212,161 L 218,161 Z" fill="#FFD700" />
              
              {/* Sparkles */}
              <circle cx="70" cy="50" r="2" fill="#FF69B4" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="230" cy="45" r="1.5" fill="#FF69B4" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="90" cy="140" r="1.5" fill="#FF69B4" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="210" cy="145" r="2" fill="#FF69B4" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>
        
        {/* Video with lazy loading and fallback */}
        {!isOpened && (
          <div 
            ref={videoRef}
            className="video-container absolute bottom-0 left-0 w-full h-32 sm:h-40 md:h-48 lg:h-56"
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
        )}
      </div>
      <div className="cardInside">
        <h3 className="back">A Special Note!</h3>
        <p>Dear Friend,</p>
        <p>
          Hope your day is filled with love and
          laughter! May all of your birthday wishes come true.
        </p>
        
        {/* Enhanced golden ticket with better visibility */}
        <div 
          className="golden-ticket overflow-hidden absolute bottom-4 right-4 w-1/2 p-3 text-black text-center rounded-lg cursor-pointer transition-all hover:scale-110 hover:shadow-lg animate-pulse border-2 border-yellow-400"
          style={{
            background: 'linear-gradient(45deg, #d19e1d, #ffd86e, #e3a812, #ffd86e)',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 3s ease infinite'
          }}
          onClick={handleTicketClick}
          tabIndex={0}
          role="button"
          aria-label="Golden surprise ticket - click to reveal your special surprise"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTicketClick(e as any);
            }
          }}
        >
          <p className="font-bold text-sm flex items-center justify-center gap-1">
            🎫 Surprise Ticket
          </p>
          <p className="text-xs opacity-80">Click me!</p>
        </div>
      </div>
    </div>
  );
};

export default Card;