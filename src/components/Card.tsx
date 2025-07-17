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
        <div className={`relative z-10 p-4 transition-opacity duration-300 ${
          isOpened || isAnimating ? 'opacity-0' : 'opacity-100'
        }`}>
          <svg viewBox="0 0 300 150" className="w-full">
            <path id="happy-curve" d="M 50,90 A 100,50 0 0,1 250,90" fill="transparent" />
            <text className="happy" style={{ fontSize: '3.5rem' }}>
              <textPath href="#happy-curve" startOffset="50%" textAnchor="middle">
                HAPPY
              </textPath>
            </text>
            <path id="birthday-curve" d="M 20,145 A 100,50 0 0,1 280,145" fill="transparent" />
            <text className="happy" style={{ fontSize: '3.5rem' }}>
              <textPath href="#birthday-curve" startOffset="50%" textAnchor="middle">
                BIRTHDAY
              </textPath>
            </text>
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