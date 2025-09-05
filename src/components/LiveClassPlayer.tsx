'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

interface LiveClassPlayerProps {
  liveClass: {
    id: string;
    title: string;
    instructor: {
      name: string;
      avatar: string;
      title: string;
      company: string;
    };
    awsService: 'chime' | 'ivs';
    chimeRoomId?: string;
    ivsChannelArn?: string;
    startTime: string;
    duration: number;
    maxParticipants: number;
    currentParticipants: number;
    isLive: boolean;
    isUpcoming: boolean;
  };
  onJoin: () => void;
  onLeave: () => void;
}

export default function LiveClassPlayer({ liveClass, onJoin, onLeave }: LiveClassPlayerProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(liveClass.currentParticipants);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const meetingRef = useRef<any>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        
        setUser(currentUser);
        setAccessToken(token);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setError('Authentication failed. Please log in again.');
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (liveClass.isLive) {
      const timer = setInterval(() => {
        const now = new Date();
        const start = new Date(liveClass.startTime);
        const end = new Date(start.getTime() + liveClass.duration * 60000);
        
        if (now < end) {
          const remaining = end.getTime() - now.getTime();
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${hours}h ${minutes}m remaining`);
        } else {
          setTimeRemaining('Class ended');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [liveClass.isLive, liveClass.startTime, liveClass.duration]);

  const joinChimeMeeting = async () => {
    if (!liveClass.chimeRoomId || !accessToken) {
      setError('Missing meeting credentials');
      return;
    }

    try {
      setIsJoining(true);
      setError(null);

      // Simulate Chime SDK integration
      // In production, you would use the actual Chime SDK
      console.log('Joining Chime meeting:', liveClass.chimeRoomId);
      
      // Mock successful connection
      setTimeout(() => {
        setIsConnected(true);
        setIsJoining(false);
        onJoin();
        setParticipantCount(prev => prev + 1);
      }, 2000);

    } catch (error) {
      console.error('Failed to join Chime meeting:', error);
      setError('Failed to join meeting. Please try again.');
      setIsJoining(false);
    }
  };

  const joinIVSStream = async () => {
    if (!liveClass.ivsChannelArn || !accessToken) {
      setError('Missing stream credentials');
      return;
    }

    try {
      setIsJoining(true);
      setError(null);

      // Simulate IVS integration
      // In production, you would use the actual IVS player
      console.log('Joining IVS stream:', liveClass.ivsChannelArn);
      
      // Mock successful connection
      setTimeout(() => {
        setIsConnected(true);
        setIsJoining(false);
        onJoin();
        setParticipantCount(prev => prev + 1);
      }, 2000);

    } catch (error) {
      console.error('Failed to join IVS stream:', error);
      setError('Failed to join stream. Please try again.');
      setIsJoining(false);
    }
  };

  const leaveClass = () => {
    setIsConnected(false);
    setParticipantCount(prev => Math.max(0, prev - 1));
    onLeave();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (!user || !accessToken) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please log in to join live classes</p>
          <Button asChild>
            <a href="/auth/login">Sign In</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{liveClass.title}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  liveClass.isLive 
                    ? 'bg-red-500 text-white' 
                    : liveClass.isUpcoming 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {liveClass.isLive ? 'LIVE NOW' : liveClass.isUpcoming ? 'UPCOMING' : 'ENDED'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  liveClass.awsService === 'chime' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {liveClass.awsService === 'chime' ? 'INTERACTIVE' : 'BROADCAST'}
                </span>
              </CardTitle>
              <CardDescription>
                by {liveClass.instructor.name} • {liveClass.instructor.title} at {liveClass.instructor.company}
              </CardDescription>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Start: {formatTime(liveClass.startTime)}</div>
              <div>Duration: {liveClass.duration} minutes</div>
              {liveClass.isLive && <div className="text-red-600 font-medium">{timeRemaining}</div>}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Video Player Area */}
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video bg-black relative">
            {isConnected ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎥</div>
                  <div className="text-xl font-semibold mb-2">
                    {liveClass.awsService === 'chime' ? 'Chime Meeting Active' : 'IVS Stream Active'}
                  </div>
                  <div className="text-sm opacity-80">
                    {liveClass.awsService === 'chime' 
                      ? 'Interactive video conference with screen sharing, chat, and breakout rooms'
                      : 'Live broadcast stream with chat and reactions'
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">📹</div>
                  <div className="text-xl font-semibold mb-2">
                    {liveClass.isLive ? 'Class is Live!' : 'Class Starting Soon'}
                  </div>
                  <div className="text-sm opacity-80 mb-4">
                    {liveClass.awsService === 'chime' 
                      ? 'Join the interactive session to participate with video, audio, and chat'
                      : 'Join the live broadcast to watch and interact with the instructor'
                    }
                  </div>
                  {!isJoining && (
                    <Button 
                      onClick={liveClass.awsService === 'chime' ? joinChimeMeeting : joinIVSStream}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {liveClass.isLive ? 'Join Now' : 'Join When Live'}
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Video controls overlay */}
            {isConnected && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20">
                    🎤 Mute
                  </Button>
                  <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20">
                    📹 Video
                  </Button>
                  <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20">
                    📺 Share
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={leaveClass}
                >
                  Leave Class
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Class Info & Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Class Details */}
        <Card>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type:</span>
                <span className="font-medium">
                  {liveClass.awsService === 'chime' ? 'Amazon Chime SDK' : 'Amazon IVS'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Participants:</span>
                <span className="font-medium">
                  {participantCount}/{liveClass.maxParticipants}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Status:</span>
                <span className={`font-medium ${
                  isConnected ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {isConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connection:</span>
                <span className="font-medium">
                  {liveClass.awsService === 'chime' ? 'Interactive' : 'Broadcast'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Chat & Features */}
        <Card>
          <CardHeader>
            <CardTitle>Live Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveClass.awsService === 'chime' ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Video & Audio Chat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Screen Sharing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Raise Hand Feature</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Breakout Rooms</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Live Chat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Live Polls</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Emoji Reactions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Q&A Section</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isJoining && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {liveClass.awsService === 'chime' 
                ? 'Connecting to Chime meeting...' 
                : 'Connecting to live stream...'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
