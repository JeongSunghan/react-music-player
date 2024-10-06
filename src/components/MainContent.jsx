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
    q: `${genre} [Playlist] #플레이리시트 -live -shorts`,
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
  const [muted, setMuted] = useState(false); // 음소거 상태 관리
  const [favorites, setFavorites] = useState([]);
  const [lastPlayedTime, setLastPlayedTime] = useState(0); // 마지막 재생된 시간 기록
  const [unplayedTime, setUnplayedTime] = useState(0); // 재생이 되지 않은 시간 기록
  const playerRef = useRef(null);

  // 마지막 호출 시간을 localStorage에서 가져옴 -> 안되는거같음..ㅠ
  const lastFetched = localStorage.getItem('lastFetched');
  const isStale = !lastFetched || (Date.now() - new Date(lastFetched)) > THREE_DAYS_IN_MS;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["videos", selectedGenre],
    queryFn: () => fetchVideos(selectedGenre),
    staleTime: isStale ? 0 : THREE_DAYS_IN_MS,  // 3일 동안은 캐시된 데이터를 사용
    cacheTime: THREE_DAYS_IN_MS,  // 3일 동안 데이터를 유지
    refetchOnWindowFocus: false,
    onSuccess: () => {
      if (isStale) {
        localStorage.setItem('lastFetched', new Date());  // 새로 데이터를 가져오면 시간 업데이트
      }
    },
  });

  useEffect(() => {
    // 10초 이상 재생이 진행되지 않으면 다음 영상으로 넘어감
    if (unplayedTime >= 10) {
      playNextVideo();
    }
  }, [unplayedTime]);

  if (isLoading) {
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

  if (isError) {
    return <div>에러가 발생했습니다. 다시 시도해주세요.</div>;
  }

  const videos = data.items || [];

  const handlePlay = (video) => {
    setCurrentVideo(video);
    setPlaying(true);
    setUnplayedTime(0); // 새 영상을 재생할 때 재생되지 않은 시간 초기화
    setLastPlayedTime(0); // 마지막 재생 시간 초기화
  };

  const playNextVideo = () => {
    const currentIndex = videos.findIndex(
      (video) => video.id.videoId === currentVideo.id.videoId
    );
    const nextIndex = (currentIndex + 1) % videos.length; // 다음 영상으로 이동, 마지막이면 처음으로
    handlePlay(videos[nextIndex]);
  };

  const handleProgress = (state) => {
    const currentPlayedTime = state.playedSeconds;
    
    // 영상이 재생되고 있을 때
    if (currentPlayedTime > lastPlayedTime) {
      setLastPlayedTime(currentPlayedTime);
      setUnplayedTime(0); // 재생이 진행되면 재생되지 않은 시간 리셋
    } else {
      // 영상이 재생되지 않으면 재생되지 않은 시간을 증가시킴
      setUnplayedTime(unplayedTime + 1);
    }
  };

  const handleError = () => {
    // 에러 발생 시 다음 영상으로 넘어가게 처리
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
          sx={{ backgroundColor: "#3D9B3B", color: "#fff", borderColor: "#3D9B3B" }}
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
              <Typography variant="subtitle2" className="card-title">
                {video.snippet.title}
              </Typography>
              <Typography variant="caption" className="card-channel">
                {video.snippet.channelTitle}
              </Typography>
              <Box className="card-actions">
                <IconButton
                  color="inherit"
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
                  color="inherit"
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
              value={muted ? 0 : volume} // 음소거 상태일 때 슬라이더는 0
              onChange={(e, newValue) => {
                setVolume(newValue);
                setMuted(newValue === 0); // 볼륨이 0이면 음소거
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
            volume={muted ? 0 : volume / 100} // 음소거 상태면 볼륨 0, 아니면 슬라이더 값에 따라 볼륨 조절
            onProgress={handleProgress} // 진행 시간 업데이트
            onError={handleError} // 에러 발생 시 처리
          />
        </Box>
      )}
    </>
  );
};

export default MainContent;
