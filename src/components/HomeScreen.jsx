import React from 'react';
import { Box, Typography } from '@mui/material';
import '../style/HomeScreen.css';

const genres = [ '어쿠스틱', '인디', '지브리', '로파이', '발라드', '팝', '힙합', 'R&B', 'K-POP',];

const HomeScreen = ({ onSelectGenre }) => {
  return (
    <Box className="home-container">
      <Typography className="home-title">당신의 음악을 선택하세요</Typography>
      <Box className="genre-list">
        {genres.map((genre) => (
          <button
            key={genre}
            className="genre-button"
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </Box>
    </Box>
  );
};

export default HomeScreen;
