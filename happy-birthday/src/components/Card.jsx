import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Ticket from './Ticket';

const CardContainer = styled(motion.div)`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 280px;
  height: 180px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform-style: preserve-3d;
`;

const Prompt = styled.h2`
  color: #d14a83;
  font-family: 'Georgia', serif;
`;

function Card() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <CardContainer
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: -100, opacity: 1 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleCardClick}
      style={{ rotateY: isFlipped ? 180 : 0 }}
    >
      {isFlipped ? (
        <Ticket />
      ) : (
        <Prompt>Click to explore your card!</Prompt>
      )}
    </CardContainer>
  );
}

export default Card; 