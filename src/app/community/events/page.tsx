'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('upcoming');

  const eventTypes = [
    { id: 'all', name: 'All Events' },
    { id: 'live-session', name: 'Live Sessions' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'networking', name: 'Networking' },
    { id: 'mentorship', name: 'Mentorship' },
    { id: 'competition', name: 'Competitions' }
  ];

  const statusFilters = [
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'live', name: 'Live Now' },
    { id: 'past', name: 'Past Events' }
  ];

  const events = [
    {
      id: 1,
      title: "Weekly Startup Pitch Session",
      description: "Practice your pitch and get feedback from experienced entrepreneurs and investors",
      type: "live-session",
      date: "2024-01-15",
      time: "18:00",
      duration: "2 hours",
      host: "Sarah Chen",
      attendees: 45,
      maxAttendees: 50,
      status: "upcoming",
      isLive: false,
      isRegistered: true,
      tags: ["Pitch", "Feedback", "Networking"],
      location: "Virtual",
      requirements: "Pitch deck ready"
    },
    {
      id: 2,
      title: "AI & ML Workshop: Building Your First Model",
      description: "Hands-on workshop covering the basics of machine learning and AI implementation",
      type: "workshop",
      date: "2024-01-18",
      time: "14:00",
      duration: "3 hours",
      host: "Mike Kumar",
      attendees: 89,
      maxAttendees: 100,
      status: "upcoming",
      isLive: false,
      isRegistered: false,
      tags: ["AI", "Machine Learning", "Hands-on"],
      location: "Virtual",
      requirements: "Basic Python knowledge"
    },
    {
      id: 3,
      title: "Mentor Office Hours - Funding Strategies",
      description: "Get direct advice from VCs and successful entrepreneurs about raising capital",
      type: "mentorship",
      date: "2024-01-12",
      time: "16:00",
      duration: "1 hour",
      host: "Alex Johnson",
      attendees: 12,
      maxAttendees: 15,
      status: "live",
      isLive: true,
      isRegistered: true,
      tags: ["Funding", "VC", "Mentorship"],
      location: "Virtual",
      requirements: "None"
    },
    {
      id: 4,
      title: "Startup Networking Mixer",
      description: "Connect with fellow entrepreneurs, potential co-founders, and industry professionals",
      type: "networking",
      date: "2024-01-20",
      time: "19:00",
      duration: "2 hours",
      host: "Priya Sharma",
      attendees: 67,
      maxAttendees: 80,
      status: "upcoming",
      isLive: false,
      isRegistered: false,
      tags: ["Networking", "Co-founders", "Industry"],
      location: "Virtual",
      requirements: "None"
    },
    {
      id: 5,
      title: "Hackathon: Build a MVP in 48 Hours",
      description: "Team up with other developers and entrepreneurs to build a working MVP",
      type: "competition",
      date: "2024-01-25",
      time: "09:00",
      duration: "48 hours",
      host: "Emma Davis",
      attendees: 156,
      maxAttendees: 200,
      status: "upcoming",
      isLive: false,
      isRegistered: true,
      tags: ["Hackathon", "MVP", "Team Building"],
      location: "Virtual",
      requirements: "Development skills preferred"
    },
    {
      id: 6,
      title: "React Fundamentals Live Coding",
      description: "Live coding session covering React hooks, state management, and best practices",
      type: "live-session",
      date: "2024-01-10",
      time: "15:00",
      duration: "1.5 hours",
      host: "David Wilson",
      attendees: 234,
      maxAttendees: 300,
      status: "past",
      isLive: false,
      isRegistered: false,
      tags: ["React", "Coding", "Frontend"],
      location: "Virtual",
      requirements: "Basic JavaScript knowledge"
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string, isLive: boolean) => {
    if (isLive) return 'bg-red-100 text-red-800 border-red-300';
    if (status === 'upcoming') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (status === 'past') return 'bg-gray-100 text-gray-800 border-gray-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'live-session': return '🎥';
      case 'workshop': return '🛠️';
      case 'networking': return '🤝';
      case 'mentorship': return '👨‍🏫';
      case 'competition': return '🏆';
      default: return '📅';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Events 📅
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Join live sessions, workshops, and networking events with fellow entrepreneurs
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {eventTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={filterType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(type.id)}
                    className="whitespace-nowrap"
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              {statusFilters.map((status) => (
                <Button
                  key={status.id}
                  variant={filterStatus === status.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status.id)}
                >
                  {status.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getTypeIcon(event.type)}</span>
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {event.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(event.status, event.isLive)}`}
                      >
                        {event.isLive ? 'LIVE' : event.status.toUpperCase()}
                      </Badge>
                      {event.isRegistered && (
                        <Badge variant="default" className="text-xs">
                          Registered
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Event Details */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span>📅</span>
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>⏱️</span>
                        <span>{event.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>👨‍🏫</span>
                        <span>Hosted by {event.host}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>📍</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>👥</span>
                        <span>{event.attendees}/{event.maxAttendees} attendees</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Requirements */}
                    {event.requirements && (
                      <div className="text-xs text-gray-500">
                        <strong>Requirements:</strong> {event.requirements}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {event.isLive ? (
                        <Button className="flex-1 bg-red-600 hover:bg-red-700">
                          Join Live
                        </Button>
                      ) : event.isRegistered ? (
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                      ) : event.status === 'upcoming' ? (
                        <Button className="flex-1">
                          Register
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1">
                          View Recording
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        📅 Add to Calendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterStatus('upcoming');
              }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Create Event Button (Admin only) */}
          <div className="mt-8 text-center">
            <Button size="lg" className="bg-[#2C4E41] hover:bg-[#2C4E41]/90">
              + Create New Event
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
