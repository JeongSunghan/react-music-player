import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Slider,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  FavoriteBorder,
  Favorite,
  VolumeUp,
  VolumeOff,
} from "@mui/icons-material";
import ReactPlayer from "react-player";
import { useQuery } from "@tanstack/react-query";
import "../style/MainContent.css";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000; // 3일(72시간) 밀리초

// API 호출로 영상 불러오기
const fetchVideos = async (genre) => {
  const params = {
    part: "snippet",
    q: `${genre} [Playlist] #플레이리스트 -live -shorts`,
    type: "video",
    maxResults: 12,
    regionCode: "KR",
    relevanceLanguage: "ko",
    key: API_KEY,
  };
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    { params }
  );
  return response.data;
};

const MainContent = ({ selectedGenre, onBack }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [lastPlayedTime, setLastPlayedTime] = useState(0);
  const [unplayedTime, setUnplayedTime] = useState(0);
  const playerRef = useRef(null);

  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    const cachedData = localStorage.getItem(`videos_${selectedGenre}`);
    const lastFetched = localStorage.getItem(`lastFetched_${selectedGenre}`);
    const isStale = !lastFetched || Date.now() - lastFetched > THREE_DAYS_IN_MS;

    if (cachedData && !isStale) {
      setLocalData(JSON.parse(cachedData));
    }
  }, [selectedGenre]);

  const shouldFetch = !localData;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["videos", selectedGenre],
    queryFn: () => fetchVideos(selectedGenre),
    enabled: shouldFetch,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      localStorage.setItem(
        `videos_${selectedGenre}`,
        JSON.stringify(data)
      );
      localStorage.setItem(`lastFetched_${selectedGenre}`, Date.now());
      setLocalData(data);
    },
  });

  useEffect(() => {
    if (unplayedTime >= 10) {
      playNextVideo();
    }    
  }, [unplayedTime]);

  if (isLoading && !localData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError && !localData) {
    return <div>에러가 발생했습니다. 다시 시도해주세요.</div>;
  }

  const videos = localData ? localData.items : data ? data.items : [];

  const handlePlay = (video) => {
    setCurrentVideo(video);
    setPlaying(true);
    setUnplayedTime(0);
    setLastPlayedTime(0);
  };

  const playNextVideo = () => {
    const currentIndex = videos.findIndex(
      (video) => video.id.videoId === currentVideo.id.videoId
    );
    const nextIndex = (currentIndex + 1) % videos.length;
    handlePlay(videos[nextIndex]);
  };

  const handleProgress = (state) => {
    const currentPlayedTime = state.playedSeconds;

    if (currentPlayedTime > lastPlayedTime) {
      setLastPlayedTime(currentPlayedTime);
      setUnplayedTime(0);
    } else {
      setUnplayedTime((prev) => prev + 1);
    }
  };

  const handleError = () => {
    playNextVideo();
  };

  const toggleFavorite = (videoId) => {
    if (favorites.includes(videoId)) {
      setFavorites(favorites.filter((id) => id !== videoId));
    } else {
      setFavorites([...favorites, videoId]);
    }
  };

  return (
    <>
      <Box
        sx={{
          padding: "20px 20px 0 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          className="backButn"
          variant="contained"
          onClick={onBack}
          sx={{
            backgroundColor: "#3D9B3B",
            color: "#fff",
            borderColor: "#3D9B3B",
          }}
        >
          장르 선택으로 돌아가기
        </Button>
        <Typography variant="h5" sx={{ marginLeft: "20px" }}>
          {selectedGenre} 음악
        </Typography>
      </Box>
      <Box className="video-list-container">
        {videos.map((video) => (
          <Card
            key={video.id.videoId}
            className="videoCard"
            sx={{ backgroundColor: "#181818" }}
          >
            <CardMedia
              component="img"
              image={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="card-media"
              onClick={() => handlePlay(video)}
            />
            <CardContent className="card-content">
              <Typography
                variant="subtitle2"
                className="card-title scrolling-text"
              >
                {video.snippet.title}
              </Typography>
              <Typography variant="caption" className="card-channel">
                {video.snippet.channelTitle}
              </Typography>
              <Box className="card-actions">
                <IconButton
                  sx={{ color: "#959EA2" }}
                  size="small"
                  className="favorite-icon"
                  onClick={() => toggleFavorite(video.id.videoId)}
                >
                  {favorites.includes(video.id.videoId) ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                <IconButton
                  sx={{ color: "#959EA2" }}
                  size="small"
                  className="play-icon"
                  onClick={() => handlePlay(video)}
                >
                  <PlayArrow />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {currentVideo && (
        <Box className="player-container">
          <Box className="player-info">
            <img
              src={currentVideo.snippet.thumbnails.default.url}
              alt={currentVideo.snippet.title}
            />
            <Box className="info-text">
              <Typography className="title">
                {currentVideo.snippet.title}
              </Typography>
              <Typography className="artist">
                {currentVideo.snippet.channelTitle}
              </Typography>
            </Box>
          </Box>

          <Box className="player-controls">
            <Box className="control-buttons">
              <IconButton color="inherit" onClick={playNextVideo}>
                <SkipPrevious />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => setPlaying(!playing)}
                sx={{ fontSize: "2rem" }}
              >
                {playing ? (
                  <Pause fontSize="large" />
                ) : (
                  <PlayArrow fontSize="large" />
                )}
              </IconButton>
              <IconButton color="inherit" onClick={playNextVideo}>
                <SkipNext />
              </IconButton>
            </Box>
          </Box>

          <Box className="volume-container">
            <IconButton color="inherit" onClick={() => setMuted(!muted)}>
              {muted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
            </IconButton>

            <Slider
              value={muted ? 0 : volume}
              onChange={(e, newValue) => {
                setVolume(newValue);
                setMuted(newValue === 0);
              }}
              min={0}
              max={100}
              className="volume-bar"
              size="small"
            />
          </Box>

          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${currentVideo.id.videoId}`}
            playing={playing}
            controls={false}
            width="0"
            height="0"
            volume={muted ? 0 : volume / 100}
            onProgress={handleProgress}
            onError={handleError}
          />
        </Box>
      )}
    </>
  );
};

export default MainContent;
