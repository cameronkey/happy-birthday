import React from 'react';
import './Card.css';

type CardProps = {
  handleTicketClick: () => void;
};

const Card: React.FC<CardProps> = ({ handleTicketClick }) => {
  return (
    <div 
      className="birthdayCard"
      onClick={handleTicketClick}
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
        <h3 className="back">HAPPY BIRTHDAY!</h3>
        <p>Dear Friend,</p>
        <p>
          Happy birthday!! I hope your day is filled with lots of love and
          laughter! May all of your birthday wishes come true.
        </p>
        <p className="name">From a friend</p>
      </div>
    </div>
  );
};

export default Card;
  