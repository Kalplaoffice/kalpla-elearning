'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function VoiceRoomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const rooms = [
    {
      id: 1,
      name: "Startup Pitch Practice",
      description: "Practice your pitch and get feedback from mentors",
      type: "voice",
      participants: 12,
      maxParticipants: 20,
      isLive: true,
      host: "Sarah Chen",
      category: "Mentorship"
    },
    {
      id: 2,
      name: "React Q&A Session",
      description: "Ask questions about React development",
      type: "video",
      participants: 8,
      maxParticipants: 15,
      isLive: true,
      host: "Mike Kumar",
      category: "Technical"
    },
    {
      id: 3,
      name: "Networking Hour",
      description: "Connect with fellow entrepreneurs",
      type: "voice",
      participants: 25,
      maxParticipants: 50,
      isLive: true,
      host: "Priya Sharma",
      category: "Networking"
    },
    {
      id: 4,
      name: "Study Group - AI/ML",
      description: "Study session for AI and Machine Learning concepts",
      type: "video",
      participants: 6,
      maxParticipants: 10,
      isLive: false,
      host: "Alex Johnson",
      category: "Study"
    },
    {
      id: 5,
      name: "Mentor Office Hours",
      description: "Get direct help from industry experts",
      type: "video",
      participants: 3,
      maxParticipants: 8,
      isLive: true,
      host: "Emma Davis",
      category: "Mentorship"
    }
  ];

  const currentRoom = selectedRoom ? rooms.find(r => r.id.toString() === selectedRoom) : null;

  const participants = currentRoom ? [
    { name: "Sarah Chen", role: "Host", isSpeaking: true, isMuted: false, avatar: "SC" },
    { name: "Mike Kumar", role: "Participant", isSpeaking: false, isMuted: true, avatar: "MK" },
    { name: "Priya Sharma", role: "Participant", isSpeaking: false, isMuted: false, avatar: "PS" },
    { name: "Alex Johnson", role: "Participant", isSpeaking: true, isMuted: false, avatar: "AJ" },
    { name: "You", role: "Participant", isSpeaking: false, isMuted: isMuted, avatar: "U" }
  ] : [];

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinRoom = (roomId: string) => {
    setSelectedRoom(roomId);
    // In a real app, this would connect to the voice/video room
    console.log('Joining room:', roomId);
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    setIsMuted(false);
    setIsVideoOn(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice & Video Rooms</h1>
            <p className="text-gray-600">Join live discussions, study groups, and networking sessions</p>
          </div>

          {!selectedRoom ? (
            <>
              {/* Search and Filter */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search rooms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">All Rooms</Button>
                    <Button variant="outline">Live Only</Button>
                    <Button variant="outline">Voice Only</Button>
                    <Button variant="outline">Video Only</Button>
                  </div>
                </div>
              </div>

              {/* Rooms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <Card key={room.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">{room.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {room.isLive && (
                            <Badge variant="destructive" className="animate-pulse">
                              LIVE
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {room.type === 'voice' ? '🎤' : '📹'} {room.type}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{room.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Room Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>👥 {room.participants}/{room.maxParticipants} participants</span>
                          <span>Hosted by {room.host}</span>
                        </div>

                        {/* Category */}
                        <Badge variant="outline" className="text-xs">
                          {room.category}
                        </Badge>

                        {/* Join Button */}
                        <Button
                          className="w-full"
                          onClick={() => handleJoinRoom(room.id.toString())}
                          disabled={room.participants >= room.maxParticipants}
                        >
                          {room.participants >= room.maxParticipants ? 'Room Full' : 'Join Room'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Create Room Button */}
              <div className="mt-8 text-center">
                <Button size="lg" className="bg-[#2C4E41] hover:bg-[#2C4E41]/90">
                  + Create New Room
                </Button>
              </div>
            </>
          ) : (
            /* Room View */
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Room Area */}
              <div className="lg:col-span-3">
                <Card className="h-[500px] flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{currentRoom?.name}</CardTitle>
                        <CardDescription>{currentRoom?.description}</CardDescription>
                      </div>
                      <Button variant="outline" onClick={handleLeaveRoom}>
                        Leave Room
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        {currentRoom?.type === 'voice' ? '🎤' : '📹'}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {currentRoom?.type === 'voice' ? 'Voice Room' : 'Video Room'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {currentRoom?.participants} participants online
                      </p>
                      
                      {/* Room Controls */}
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant={isMuted ? "destructive" : "outline"}
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? '🔇 Unmute' : '🎤 Mute'}
                        </Button>
                        
                        {currentRoom?.type === 'video' && (
                          <Button
                            variant={isVideoOn ? "default" : "outline"}
                            onClick={() => setIsVideoOn(!isVideoOn)}
                          >
                            {isVideoOn ? '📹 Video On' : '📹 Video Off'}
                          </Button>
                        )}
                        
                        <Button variant="outline">📞 Call</Button>
                        <Button variant="outline">📁 Share Screen</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Participants Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Participants ({participants.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {participants.map((participant, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {participant.avatar}
                              </span>
                            </div>
                            {participant.isSpeaking && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{participant.name}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {participant.role}
                              </Badge>
                              {participant.isMuted && (
                                <span className="text-xs text-red-500">🔇 Muted</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Room Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Room Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Rules</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-1">
                        <li>• Be respectful to all participants</li>
                        <li>• Mute yourself when not speaking</li>
                        <li>• Raise hand to ask questions</li>
                        <li>• No inappropriate content</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">Host</h4>
                      <p className="text-sm text-gray-600">{currentRoom?.host}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
