'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  duration: number;
  isFree: boolean;
  isPreview: boolean;
  onProgressUpdate?: (progress: number) => void;
  onComplete?: () => void;
  onNoteAdd?: (timestamp: number, note: string) => void;
  onBookmarkAdd?: (timestamp: number) => void;
  notes?: VideoNote[];
  bookmarks?: number[];
  subtitles?: SubtitleTrack[];
  playbackSpeed?: number;
  quality?: VideoQuality;
  onSpeedChange?: (speed: number) => void;
  onQualityChange?: (quality: VideoQuality) => void;
}

interface VideoNote {
  id: string;
  timestamp: number;
  content: string;
  createdAt: string;
}

interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  url: string;
  isDefault?: boolean;
}

type VideoQuality = '360p' | '480p' | '720p' | '1080p' | 'auto';

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  duration,
  isFree,
  isPreview,
  onProgressUpdate,
  onComplete,
  onNoteAdd,
  onBookmarkAdd,
  notes = [],
  bookmarks = [],
  subtitles = [],
  playbackSpeed = 1,
  quality = 'auto',
  onSpeedChange,
  onQualityChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleTrack | null>(null);

  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualities: VideoQuality[] = ['auto', '360p', '480p', '720p', '1080p'];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration;
      const progressPercent = (current / total) * 100;
      
      setCurrentTime(current);
      setProgress(progressPercent);
      onProgressUpdate?.(progressPercent);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [onProgressUpdate, onComplete]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    const defaultSubtitle = subtitles.find(s => s.isDefault) || subtitles[0];
    if (defaultSubtitle) {
      setCurrentSubtitle(defaultSubtitle);
    }
  }, [subtitles]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = (parseFloat(e.target.value) / 100) * video.duration;
    video.currentTime = seekTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const addNote = () => {
    if (newNote.trim() && onNoteAdd) {
      onNoteAdd(currentTime, newNote.trim());
      setNewNote('');
    }
  };

  const addBookmark = () => {
    if (onBookmarkAdd) {
      onBookmarkAdd(currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-black rounded-lg overflow-hidden">
            {/* Video Element */}
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto"
              poster="/api/placeholder/800/450"
              onMouseMove={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {currentSubtitle && (
                <track
                  kind="subtitles"
                  src={currentSubtitle.url}
                  srcLang={currentSubtitle.language}
                  label={currentSubtitle.label}
                  default={currentSubtitle.isDefault}
                />
              )}
            </video>

            {/* Overlay Controls */}
            {showControls && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                {/* Top Controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{title}</h3>
                    {isFree && <Badge className="bg-green-500">Free</Badge>}
                    {isPreview && <Badge className="bg-blue-500">Preview</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowNotes(!showNotes)}
                      className="text-white hover:bg-white/20"
                    >
                      📝 Notes
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowBookmarks(!showBookmarks)}
                      className="text-white hover:bg-white/20"
                    >
                      🔖 Bookmarks
                    </Button>
                  </div>
                </div>

                {/* Center Play Button */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      onClick={togglePlay}
                      className="bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                      ▶️
                    </Button>
                  </div>
                )}

                {/* Bottom Controls */}
                <div className="absolute bottom-4 left-4 right-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #FF804B 0%, #FF804B ${progress}%, rgba(255,255,255,0.3) ${progress}%, rgba(255,255,255,0.3) 100%)`
                      }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={togglePlay}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? '⏸️' : '▶️'}
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? '🔇' : '🔊'}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatDuration(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Speed Control */}
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          className="text-white hover:bg-white/20"
                        >
                          {playbackSpeed}x
                        </Button>
                        {showSpeedMenu && (
                          <div className="absolute bottom-10 right-0 bg-black/80 rounded-lg p-2 min-w-[100px]">
                            {speeds.map(speed => (
                              <button
                                key={speed}
                                onClick={() => {
                                  onSpeedChange?.(speed);
                                  setShowSpeedMenu(false);
                                }}
                                className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-white/20 ${
                                  playbackSpeed === speed ? 'text-[#FF804B]' : 'text-white'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quality Control */}
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowQualityMenu(!showQualityMenu)}
                          className="text-white hover:bg-white/20"
                        >
                          {quality}
                        </Button>
                        {showQualityMenu && (
                          <div className="absolute bottom-10 right-0 bg-black/80 rounded-lg p-2 min-w-[100px]">
                            {qualities.map(q => (
                              <button
                                key={q}
                                onClick={() => {
                                  onQualityChange?.(q);
                                  setShowQualityMenu(false);
                                }}
                                className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-white/20 ${
                                  quality === q ? 'text-[#FF804B]' : 'text-white'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Subtitles */}
                      {subtitles.length > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowSubtitles(!showSubtitles)}
                          className="text-white hover:bg-white/20"
                        >
                          CC
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={addBookmark}
                        className="text-white hover:bg-white/20"
                      >
                        🔖
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleFullscreen}
                        className="text-white hover:bg-white/20"
                      >
                        {isFullscreen ? '⤢' : '⤡'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Panel */}
            {showNotes && (
              <div className="absolute top-16 right-4 w-80 bg-black/90 rounded-lg p-4 max-h-96 overflow-y-auto">
                <h4 className="text-white font-semibold mb-3">Video Notes</h4>
                <div className="space-y-2 mb-4">
                  {notes.map(note => (
                    <div key={note.id} className="bg-white/10 rounded p-2">
                      <div className="text-xs text-gray-300 mb-1">
                        {formatTime(note.timestamp)}
                      </div>
                      <div className="text-white text-sm">{note.content}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add note at current time"
                    className="flex-1 px-2 py-1 bg-white/20 text-white placeholder-gray-400 rounded text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addNote()}
                  />
                  <Button onClick={addNote} size="sm" className="bg-[#FF804B] hover:bg-[#FF804B]/90">
                    Add
                  </Button>
                </div>
              </div>
            )}

            {/* Bookmarks Panel */}
            {showBookmarks && (
              <div className="absolute top-16 right-4 w-80 bg-black/90 rounded-lg p-4 max-h-96 overflow-y-auto">
                <h4 className="text-white font-semibold mb-3">Bookmarks</h4>
                <div className="space-y-2">
                  {bookmarks.map((timestamp, index) => (
                    <div key={index} className="bg-white/10 rounded p-2 flex items-center justify-between">
                      <span className="text-white text-sm">{formatTime(timestamp)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = timestamp;
                          }
                        }}
                        className="text-white hover:bg-white/20"
                      >
                        Go to
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoPlayer;
