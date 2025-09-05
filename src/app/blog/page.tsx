import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock blog data - replace with actual GraphQL queries
const blogPosts = [
  {
    id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    slug: 'future-web-development-trends-2024',
    excerpt: 'Explore the latest trends shaping web development, from AI integration to new frameworks and tools.',
    content: 'Full blog post content...',
    author: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40'
    },
    featuredImage: '/api/placeholder/400/250',
    tags: ['Web Development', 'Technology', 'Trends'],
    publishedAt: '2024-01-15',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Getting Started with Machine Learning: A Complete Beginner\'s Guide',
    slug: 'machine-learning-beginners-guide',
    excerpt: 'Learn the fundamentals of machine learning and how to start your journey in AI development.',
    content: 'Full blog post content...',
    author: {
      id: '2',
      name: 'Michael Chen',
      avatar: '/api/placeholder/40/40'
    },
    featuredImage: '/api/placeholder/400/250',
    tags: ['Machine Learning', 'AI', 'Tutorial'],
    publishedAt: '2024-01-12',
    readTime: '8 min read'
  },
  {
    id: '3',
    title: 'Building Scalable Applications with AWS: Best Practices',
    slug: 'aws-scalable-applications-best-practices',
    excerpt: 'Discover how to build and deploy scalable applications using AWS services and best practices.',
    content: 'Full blog post content...',
    author: {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: '/api/placeholder/40/40'
    },
    featuredImage: '/api/placeholder/400/250',
    tags: ['AWS', 'Cloud Computing', 'Architecture'],
    publishedAt: '2024-01-10',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'The Complete Guide to React 18: New Features and Improvements',
    slug: 'react-18-complete-guide-new-features',
    excerpt: 'Everything you need to know about React 18, including concurrent features and performance improvements.',
    content: 'Full blog post content...',
    author: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40'
    },
    featuredImage: '/api/placeholder/400/250',
    tags: ['React', 'JavaScript', 'Frontend'],
    publishedAt: '2024-01-08',
    readTime: '7 min read'
  },
  {
    id: '5',
    title: 'Data Science Career Path: From Beginner to Data Scientist',
    slug: 'data-science-career-path-beginner-to-expert',
    excerpt: 'A comprehensive roadmap for building a successful career in data science, including skills and resources.',
    content: 'Full blog post content...',
    author: {
      id: '2',
      name: 'Michael Chen',
      avatar: '/api/placeholder/40/40'
    },
    featuredImage: '/api/placeholder/400/250',
    tags: ['Data Science', 'Career', 'Learning Path'],
    publishedAt: '2024-01-05',
    readTime: '10 min read'
  },
  {
    id: '6',
    title: 'DevOps Culture: How to Implement Continuous Integration and Deployment',
    slug: 'devops-culture-cicd-implementation',
    excerpt: 'Learn how to establish a DevOps culture in your organization and implement effective CI/CD pipelines.',
    content: 'Full blog post content...',
    author: {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: '/api/placeholder/40/40'
    },
    featuredImage: '/api/placeholder/400/250',
    tags: ['DevOps', 'CI/CD', 'Culture'],
    publishedAt: '2024-01-03',
    readTime: '9 min read'
  }
];

const categories = ['All', 'Web Development', 'Data Science', 'Cloud Computing', 'Machine Learning', 'DevOps', 'Career', 'Tutorial'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Stay updated with the latest insights, tutorials, and industry trends in technology and education.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={blogPosts[0].featuredImage}
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-[#FF804B]/10 text-[#FF804B] text-sm px-2 py-1 rounded">
                    {blogPosts[0].tags[0]}
                  </span>
                  <span className="text-gray-500 text-sm">{blogPosts[0].readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <Link href={`/blog/${blogPosts[0].slug}`}>
                    {blogPosts[0].title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={blogPosts[0].author.avatar}
                      alt={blogPosts[0].author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{blogPosts[0].author.name}</p>
                      <p className="text-sm text-gray-500">{blogPosts[0].publishedAt}</p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/blog/${blogPosts[0].slug}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {post.tags[0]}
                  </span>
                  <span className="text-gray-500 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">{post.author.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{post.publishedAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
}
