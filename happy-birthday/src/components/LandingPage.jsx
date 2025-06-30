import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Envelope from './Envelope';

const LandingContainer = styled.div`
  background-color: #fde2e4;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
`;

const Prompt = styled.h1`
  color: #d14a83;
  font-family: 'Georgia', serif;
  font-size: 2rem;
  margin-bottom: 2rem;
`;

function LandingPage() {
  const [showEnvelope, setShowEnvelope] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnvelope(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LandingContainer>
      <Prompt>A surprise is arriving...</Prompt>
      {showEnvelope && <Envelope />}
    </LandingContainer>
  );
}

export default LandingPage; 