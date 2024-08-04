// components/ConfettiButton.js
import React, { useState } from 'react';
import Confetti from 'react-confetti';
import IconButton from '@mui/material/IconButton';
import Favorite from '@mui/icons-material/Favorite';
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
`;

const BouncyIconButton = styled(IconButton)({
  animation: `${bounce} 1s ease`
});

const ConfettiButton = () => {
  const [confettiVisible, setConfettiVisible] = useState(false);

  const handleClick = () => {
    setConfettiVisible(true);
    setTimeout(() => setConfettiVisible(false), 5000); // Hide confetti after 5 seconds
  };

  return (
    <div>
      <BouncyIconButton onClick={handleClick}>
        <Favorite color="primary" />
      </BouncyIconButton>
      {confettiVisible && <Confetti />}
    </div>
  );
};

export default ConfettiButton;
