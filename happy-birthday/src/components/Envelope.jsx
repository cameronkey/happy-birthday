import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHandPointRight } from 'react-icons/fa';
import Card from './Card';

const EnvelopeContainer = styled(motion.div)`
  position: relative;
  width: 300px;
  height: 200px;
  cursor: grab;
`;

const EnvelopeFlap = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: #d14a83;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform-origin: top;
`;

const EnvelopeBody = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: #d14a83;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const PromptContainer = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 105%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #d14a83;
`;

function Envelope() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const audioRef = useRef(null);

  const handleDragEnd = (event, info) => {
    if (info.offset.y < -50) {
      setIsOpen(true);
      setIsCardVisible(true);
      audioRef.current.play();
    }
  };

  return (
    <EnvelopeContainer
      initial={{ y: -500, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, delay: 0.5 }}
      onAnimationComplete={() => audioRef.current.play()}
    >
      <audio ref={audioRef} src="/sounds/envelope-sound.wav" />
      <EnvelopeFlap
        animate={{ rotateX: isOpen ? -180 : 0 }}
        transition={{ duration: 0.5 }}
      />
      <EnvelopeBody />
      {isCardVisible && <Card />}
      <motion.div
        drag="y"
        dragConstraints={{ top: -100, bottom: 0 }}
        onDragEnd={handleDragEnd}
        style={{ position: 'absolute', top: '50px', left: '0px', height: '100px', width: '300px', zIndex: 10 }}
      />
      <PromptContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <FaHandPointRight style={{ marginRight: '10px' }} />
        Pull here to open the envelope!
      </PromptContainer>
    </EnvelopeContainer>
  );
}

export default Envelope; 