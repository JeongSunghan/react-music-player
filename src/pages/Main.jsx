import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomeScreen from '../components/HomeScreen';
import MainContent from '../components/MainContent';
import '../style/main.css';

const queryClient = new QueryClient();

const Main = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      {selectedGenre ? (
        <MainContent
          selectedGenre={selectedGenre}
          onBack={() => setSelectedGenre(null)}
        />
      ) : (
        <HomeScreen onSelectGenre={setSelectedGenre} />
      )}
    </QueryClientProvider>
  );
};

export default Main;
