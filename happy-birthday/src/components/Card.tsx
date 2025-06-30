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
      <div className="cardFront">
        <h3 className="happy">HAPPY BIRTHDAY Love!</h3>
        <div className="balloons">
          <div className="balloonOne" />
          <div className="balloonTwo" />
          <div className="balloonThree" />
          <div className="balloonFour" />
        </div>
      </div>
      <div className="cardInside">
        <h3 className="back">A Special Note!</h3>
        <p>Dear Friend,</p>
        <p>
          Hope your day is filled with love and
          laughter! May all your wishes come true.
        </p>
        <div 
          className="absolute bottom-4 right-4 w-1/2 p-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-center rounded-lg cursor-pointer hover:from-yellow-500 hover:to-orange-600 transition-all"
          onClick={handleTicketClick}
        >
          <p className="font-bold text-sm">Surprise Ticket</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
  