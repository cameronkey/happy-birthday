import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TicketContainer = styled(motion.div)`
  width: 250px;
  height: 150px;
  background-image: url('/images/ticket.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Prompt = styled.h3`
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
  text-align: center;
`;

function Ticket() {
  const handleTicketClick = () => {
    const link = document.createElement('a');
    link.href = '/gifts/surprise.txt';
    link.download = 'surprise.txt';
    link.click();
  };

  return (
    <TicketContainer
      onClick={handleTicketClick}
      whileHover={{ scale: 1.1 }}
    >
      <Prompt>
        Click your ticket to see your gift!
        <br />
        ⬇️ Download your surprise!
      </Prompt>
    </TicketContainer>
  );
}

export default Ticket; 