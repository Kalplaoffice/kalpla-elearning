'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'templates', name: 'Templates' },
    { id: 'guides', name: 'Guides' },
    { id: 'tools', name: 'Tools' },
    { id: 'books', name: 'Books' },
    { id: 'videos', name: 'Videos' },
    { id: 'articles', name: 'Articles' }
  ];

  const fileTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'pdf', name: 'PDF' },
    { id: 'doc', name: 'Document' },
    { id: 'video', name: 'Video' },
    { id: 'link', name: 'Link' },
    { id: 'tool', name: 'Tool' }
  ];

  const resources = [
    {
      id: 1,
      title: "Startup Pitch Deck Template",
      description: "A comprehensive template for creating investor-ready pitch decks with examples and best practices",
      category: "templates",
      type: "pdf",
      author: "Sarah Chen",
      downloads: 1247,
      rating: 4.9,
      fileSize: "2.3 MB",
      tags: ["Pitch Deck", "Investors", "Template"],
      isRecommended: true,
      uploadDate: "2024-01-10"
    },
    {
      id: 2,
      title: "Customer Interview Guide",
      description: "Step-by-step guide for conducting effective customer interviews to validate your startup idea",
      category: "guides",
      type: "pdf",
      author: "Mike Kumar",
      downloads: 892,
      rating: 4.8,
      fileSize: "1.8 MB",
      tags: ["Customer Research", "Validation", "Interviews"],
      isRecommended: true,
      uploadDate: "2024-01-08"
    },
    {
      id: 3,
      title: "Figma UI Kit for Startups",
      description: "Complete UI kit with components, icons, and templates for building your MVP",
      category: "templates",
      type: "link",
      author: "Priya Sharma",
      downloads: 1567,
      rating: 4.7,
      fileSize: "N/A",
      tags: ["UI/UX", "Design", "Figma"],
      isRecommended: false,
      uploadDate: "2024-01-05"
    },
    {
      id: 4,
      title: "React Development Best Practices",
      description: "Video tutorial covering React hooks, state management, and performance optimization",
      category: "videos",
      type: "video",
      author: "Alex Johnson",
      downloads: 2341,
      rating: 4.9,
      fileSize: "45 MB",
      tags: ["React", "Frontend", "Tutorial"],
      isRecommended: true,
      uploadDate: "2024-01-03"
    },
    {
      id: 5,
      title: "Business Model Canvas Template",
      description: "Interactive business model canvas for planning and validating your business model",
      category: "tools",
      type: "tool",
      author: "Emma Davis",
      downloads: 678,
      rating: 4.6,
      fileSize: "N/A",
      tags: ["Business Model", "Planning", "Strategy"],
      isRecommended: false,
      uploadDate: "2024-01-01"
    },
    {
      id: 6,
      title: "The Lean Startup - Book Summary",
      description: "Comprehensive summary of Eric Ries' The Lean Startup methodology with key takeaways",
      category: "books",
      type: "pdf",
      author: "David Wilson",
      downloads: 3456,
      rating: 4.8,
      fileSize: "3.2 MB",
      tags: ["Lean Startup", "Methodology", "Book Summary"],
      isRecommended: true,
      uploadDate: "2023-12-28"
    },
    {
      id: 7,
      title: "Marketing Automation Tools Comparison",
      description: "Detailed comparison of popular marketing automation tools with pros, cons, and pricing",
      category: "articles",
      type: "pdf",
      author: "Lisa Brown",
      downloads: 1234,
      rating: 4.5,
      fileSize: "1.5 MB",
      tags: ["Marketing", "Automation", "Tools"],
      isRecommended: false,
      uploadDate: "2023-12-25"
    },
    {
      id: 8,
      title: "Financial Projections Template",
      description: "Excel template for creating 3-year financial projections for your startup",
      category: "templates",
      type: "doc",
      author: "John Smith",
      downloads: 987,
      rating: 4.7,
      fileSize: "0.8 MB",
      tags: ["Finance", "Projections", "Excel"],
      isRecommended: false,
      uploadDate: "2023-12-20"
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'video': return '🎥';
      case 'link': return '🔗';
      case 'tool': return '🛠️';
      default: return '📁';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'templates': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'guides': return 'bg-green-100 text-green-800 border-green-300';
      case 'tools': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'books': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'videos': return 'bg-red-100 text-red-800 border-red-300';
      case 'articles': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Resources 📚
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Access templates, guides, tools, and other resources shared by mentors and community members
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={filterCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              {fileTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={filterType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {resource.description}
                        </CardDescription>
                      </div>
                    </div>
                    {resource.isRecommended && (
                      <Badge variant="default" className="text-xs">
                        ⭐ Recommended
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Resource Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>👥 {resource.downloads.toLocaleString()} downloads</span>
                      <span>⭐ {resource.rating}</span>
                    </div>

                    {/* Author and Date */}
                    <div className="text-sm text-gray-600">
                      <p>by {resource.author} • {new Date(resource.uploadDate).toLocaleDateString()}</p>
                      {resource.fileSize !== 'N/A' && (
                        <p className="text-xs text-gray-500">{resource.fileSize}</p>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs capitalize ${getCategoryColor(resource.category)}`}
                      >
                        {resource.category}
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        {resource.type === 'link' ? 'Visit Link' : 'Download'}
                      </Button>
                      <Button variant="outline" size="sm">
                        👁️ Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No resources found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
                setFilterType('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Upload Resource Button */}
          <div className="mt-8 text-center">
            <Button size="lg" className="bg-[#2C4E41] hover:bg-[#2C4E41]/90">
              + Upload Resource
            </Button>
          </div>

          {/* Featured Resources */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.filter(r => r.isRecommended).slice(0, 4).map((resource) => (
                <Card key={resource.id} className="border-2 border-[#FF804B] bg-gradient-to-r from-orange-50 to-yellow-50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <span className="text-3xl">{getTypeIcon(resource.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>⭐ {resource.rating}</span>
                            <span>👥 {resource.downloads.toLocaleString()}</span>
                          </div>
                          <Button size="sm">
                            {resource.type === 'link' ? 'Visit' : 'Download'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
