'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  id: string;
  content: string;
  user: {
    name: string;
    avatar: string;
    role: string;
    isOnline: boolean;
  };
  timestamp: string;
  reactions: Array<{
    emoji: string;
    count: number;
  }>;
  isEdited?: boolean;
  editedAt?: string;
}

interface CommunityChatProps {
  channelId: string;
  channelName: string;
  channelType: 'text' | 'voice' | 'video';
  messages: Message[];
  onSendMessage: (content: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  isConnected: boolean;
}

export default function CommunityChat({
  channelId,
  channelName,
  channelType,
  messages,
  onSendMessage,
  onAddReaction,
  onRemoveReaction,
  isConnected
}: CommunityChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when channel changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [channelId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Simulate typing indicator
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      // In production, you would emit a typing event here
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'now';
    } else if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-600 text-white';
      case 'Mentor':
        return 'bg-blue-600 text-white';
      case 'Moderator':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (channelType !== 'text') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {channelType === 'voice' ? '🔊' : '📹'}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {channelType === 'voice' ? 'Voice Channel' : 'Video Channel'}
          </h3>
          <p className="text-gray-400 mb-6">
            This is a {channelType} channel. Use the voice controls to join.
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            Join {channelType === 'voice' ? 'Voice' : 'Video'} Channel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Welcome to #{channelName}</h3>
            <p className="text-gray-400">
              This is the beginning of your conversation in this channel.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex space-x-3 group hover:bg-gray-800/50 p-2 rounded-lg">
              <img
                src={message.user.avatar}
                alt={message.user.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-white">{message.user.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${getRoleColor(message.user.role)}`}>
                    {message.user.role}
                  </span>
                  {message.user.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                  <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
                  {message.isEdited && (
                    <span className="text-xs text-gray-500">(edited)</span>
                  )}
                </div>
                <p className="text-gray-300 whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        onClick={() => onRemoveReaction(message.id, reaction.emoji)}
                        className="flex items-center space-x-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <button
                    onClick={() => onAddReaction(message.id, '👍')}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                    title="Add reaction"
                  >
                    😊
                  </button>
                  <button
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                    title="More options"
                  >
                    ⋮
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-400 italic">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>
              {typingUsers.length === 1 
                ? `${typingUsers[0]} is typing...`
                : `${typingUsers.join(', ')} are typing...`
              }
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${channelName}`}
              disabled={!isConnected}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="absolute right-3 top-3 flex space-x-2">
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
                title="Add emoji"
              >
                😊
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
                title="Attach file"
              >
                📎
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
                title="Upload image"
              >
                📷
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </Button>
        </form>
        
        {!isConnected && (
          <div className="mt-2 text-sm text-red-400">
            ⚠️ Not connected to chat. Please check your connection.
          </div>
        )}
      </div>
    </div>
  );
}
