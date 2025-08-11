import React from 'react';
import './Card.css';

type CardProps = {
  isOpened: boolean;
  onCardClick: () => void;
  onTicketClick: () => void;
};

const Card: React.FC<CardProps> = ({ isOpened, onCardClick, onTicketClick }) => {
  const handleTicketClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from closing when ticket is clicked
    onTicketClick();
  };
  
  return (
    <div 
      className={`birthdayCard ${isOpened ? 'is-opened' : ''}`}
      onClick={onCardClick}
    >
      <div className="cardFront relative overflow-hidden">
        
        <div className="relative z-10 p-4">
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
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute bottom-0 left-0 w-full h-auto object-cover"
          style={{ maskImage: 'linear-gradient(to top, black 10%, transparent 100%)' }}
        >
          <source src="/videos/racoon-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="cardInside">
        {/* <h3 className="back">A Special Note!</h3> */}
        <div className="cardInsideWrapper">
          <p className="mb-4">Dear Mags,</p>
          <p className="mb-4">
            Hope your day is filled with love and
            laughter! May all of your birthday wishes come true.
          </p>
          <p>
            Love you always,
          </p>
          <p>
            Cam
          </p>
        </div>
        <div 
          className="golden-ticket overflow-hidden absolute bottom-4 right-4 w-1/2 p-2 text-black text-center rounded-lg cursor-pointer transition-all"
          style={{
            background: 'linear-gradient(to right, #d19e1d, #ffd86e, #e3a812)'
          }}
          onClick={handleTicketClick}
        >
          <p className="font-bold text-sm">Surprise Ticket</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
  