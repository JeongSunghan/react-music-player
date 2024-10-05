import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import SidebarMenu from '../components/Sidebar';
import { Slider, IconButton, Typography, Box, Card, CardMedia, CardContent } from '@mui/material';
import { PlayArrow, Pause, SkipNext, SkipPrevious, QueueMusic, FavoriteBorder } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import '../style/main.css';
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const Main = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [played, setPlayed] = useState(0);
  const [nextPageToken, setNextPageToken] = useState('');
  const playerRef = useRef(null);
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async (pageToken = '') => {
    const params = {
      part: 'snippet',
      q: 'music [Playlist] #플레이리스트 -live',
      type: 'video',
      maxResults: 10,
      regionCode: 'KR',
      relevanceLanguage: 'ko',
      key: API_KEY,
      pageToken,
    };

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', { params });
      setVideos((prevVideos) => [...prevVideos, ...response.data.items]);
      setNextPageToken(response.data.nextPageToken);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
  };

  const handleSeekChange = (e, newValue) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newValue / 100, 'fraction');
    }
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && nextPageToken) {
      fetchVideos(nextPageToken);
    }
  }, [nextPageToken]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.5,
    };
    observerRef.current = new IntersectionObserver(handleObserver, options);
    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }
    return () => {
      if (observerRef.current && containerRef.current) {
        observerRef.current.unobserve(containerRef.current);
      }
    };
  }, [handleObserver]);

  return (
    <>
      <SidebarMenu />
      <Box className="video-list-container">
        {videos.map((video) => (
          <Card
            key={video.id.videoId}
            className="video-card"
            onClick={() => {
              setCurrentVideoId(video.id.videoId);
              setPlaying(true);
            }}
          >
            <CardMedia
              component="img"
              image={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="card-media"
            />
            <CardContent className="card-content">
              <Typography variant="subtitle2" className="card-title">
                {video.snippet.title}
              </Typography>
              <Typography variant="caption" className="card-channel">
                {video.snippet.channelTitle}
              </Typography>
              <Box className="card-actions">
                <IconButton color="inherit" size="small">
                  <FavoriteBorder />
                </IconButton>
                <IconButton color="inherit" size="small" className="play-icon">
                  <PlayArrow />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
        <div ref={containerRef} style={{ width: '100%', height: '20px' }}></div>
      </Box>
      {currentVideoId && (
        <Box className="player-container">
          <Box className="player-info">
            <QueueMusic className="player-icon" />
            <Typography variant="body1" noWrap>
              {videos.find((video) => video.id.videoId === currentVideoId)?.snippet.title || '재생목록이 없습니다.'}
            </Typography>
          </Box>
          <Box className="player-controls">
            <IconButton color="inherit" onClick={() => setPlaying(!playing)}>
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton color="inherit" size="small">
              <SkipPrevious />
            </IconButton>
            <IconButton color="inherit" size="small">
              <SkipNext />
            </IconButton>
          </Box>         
          <Box className="volume-slider">
            <Slider
              value={volume}
              onChange={(e, newValue) => setVolume(newValue)}
              min={0}
              max={100}
              className="volume-bar"
              size="small"
            />
          </Box>
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${currentVideoId}`}
            playing={playing}
            controls={false}
            width="0"
            height="0"
            volume={volume / 100}
            onProgress={handleProgress}
          />
        </Box>
      )}
    </>
  );
};

export default Main;