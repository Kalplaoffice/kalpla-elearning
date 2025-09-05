import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data - replace with actual GraphQL queries
const courses = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    subtitle: 'From Zero to Hero',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack developer.',
    category: 'Web Development',
    difficulty: 'Beginner',
    price: 199.99,
    thumbnailUrl: '/api/placeholder/300/200',
    rating: 4.8,
    students: 1250,
    duration: '40 hours'
  },
  {
    id: '2',
    title: 'Data Science with Python',
    subtitle: 'Master Data Analysis',
    description: 'Comprehensive course covering Python, Pandas, NumPy, Matplotlib, and machine learning.',
    category: 'Data Science',
    difficulty: 'Intermediate',
    price: 249.99,
    thumbnailUrl: '/api/placeholder/300/200',
    rating: 4.9,
    students: 890,
    duration: '35 hours'
  },
  {
    id: '3',
    title: 'AWS Cloud Practitioner',
    subtitle: 'Cloud Computing Fundamentals',
    description: 'Learn AWS services, cloud architecture, and best practices for cloud deployment.',
    category: 'Cloud Computing',
    difficulty: 'Beginner',
    price: 179.99,
    thumbnailUrl: '/api/placeholder/300/200',
    rating: 4.7,
    students: 2100,
    duration: '25 hours'
  },
  {
    id: '4',
    title: 'Mobile App Development with React Native',
    subtitle: 'Build Cross-Platform Apps',
    description: 'Create mobile applications for iOS and Android using React Native framework.',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    price: 229.99,
    thumbnailUrl: '/api/placeholder/300/200',
    rating: 4.6,
    students: 750,
    duration: '30 hours'
  },
  {
    id: '5',
    title: 'Machine Learning Fundamentals',
    subtitle: 'AI and ML Basics',
    description: 'Introduction to machine learning algorithms, neural networks, and deep learning.',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    price: 299.99,
    thumbnailUrl: '/api/placeholder/300/200',
    rating: 4.9,
    students: 650,
    duration: '45 hours'
  },
  {
    id: '6',
    title: 'DevOps and CI/CD',
    subtitle: 'Modern Development Practices',
    description: 'Learn Docker, Kubernetes, Jenkins, and GitLab CI for modern software development.',
    category: 'DevOps',
    difficulty: 'Intermediate',
    price: 279.99,
    thumbnailUrl: '/api/placeholder/300/200',
    rating: 4.8,
    students: 980,
    duration: '32 hours'
  }
];

const categories = ['All', 'Web Development', 'Data Science', 'Cloud Computing', 'Mobile Development', 'Artificial Intelligence', 'DevOps'];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Courses</h1>
          <p className="text-xl text-gray-600">
            Discover our comprehensive collection of courses designed to advance your career
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
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

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Sort by Popularity</option>
            <option>Sort by Price</option>
            <option>Sort by Rating</option>
            <option>Sort by Newest</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                    {course.difficulty}
                  </span>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-blue-600 font-medium">{course.category}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    <div>{course.students.toLocaleString()} students</div>
                    <div>{course.duration}</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${course.price}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/courses/${course.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/courses/${course.id}/player/1`}>Start Learning</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Courses
          </Button>
        </div>
      </div>
    </div>
  );
}
