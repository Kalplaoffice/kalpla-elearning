import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock programs data - replace with actual GraphQL queries
const programs = [
  {
    id: '1',
    title: 'Bachelor of Science in Computer Science',
    subtitle: 'Comprehensive 4-year degree program',
    description: 'A comprehensive computer science degree program covering programming, algorithms, data structures, software engineering, and more.',
    duration: '4 years',
    credits: 120,
    level: 'Bachelor\'s',
    format: 'Online + Hybrid',
    price: 25000,
    thumbnailUrl: '/api/placeholder/400/250',
    university: 'Kalpla University',
    accreditation: 'Accredited by ABET',
    startDate: '2024-09-01',
    applicationDeadline: '2024-07-15',
    requirements: [
      'High school diploma or equivalent',
      'SAT/ACT scores (optional)',
      'Personal statement',
      'Letters of recommendation'
    ],
    curriculum: [
      'Programming Fundamentals',
      'Data Structures and Algorithms',
      'Software Engineering',
      'Database Systems',
      'Computer Networks',
      'Operating Systems',
      'Machine Learning',
      'Capstone Project'
    ]
  },
  {
    id: '2',
    title: 'Master of Science in Data Science',
    subtitle: 'Advanced data science and analytics program',
    description: 'An advanced master\'s program focusing on data science, machine learning, and analytics for real-world applications.',
    duration: '2 years',
    credits: 36,
    level: 'Master\'s',
    format: 'Online + Hybrid',
    price: 18000,
    thumbnailUrl: '/api/placeholder/400/250',
    university: 'Kalpla University',
    accreditation: 'Accredited by ABET',
    startDate: '2024-09-01',
    applicationDeadline: '2024-07-15',
    requirements: [
      'Bachelor\'s degree in related field',
      'GRE scores (optional)',
      'Personal statement',
      'Letters of recommendation',
      'Prerequisites in mathematics and programming'
    ],
    curriculum: [
      'Statistical Methods',
      'Machine Learning',
      'Big Data Analytics',
      'Data Visualization',
      'Deep Learning',
      'Business Intelligence',
      'Research Methods',
      'Thesis Project'
    ]
  },
  {
    id: '3',
    title: 'Associate Degree in Web Development',
    subtitle: '2-year practical web development program',
    description: 'A practical associate degree program focused on modern web development technologies and real-world projects.',
    duration: '2 years',
    credits: 60,
    level: 'Associate',
    format: 'Online',
    price: 12000,
    thumbnailUrl: '/api/placeholder/400/250',
    university: 'Kalpla University',
    accreditation: 'Accredited by ABET',
    startDate: '2024-09-01',
    applicationDeadline: '2024-07-15',
    requirements: [
      'High school diploma or equivalent',
      'Basic computer skills',
      'Personal statement'
    ],
    curriculum: [
      'HTML/CSS Fundamentals',
      'JavaScript Programming',
      'React Development',
      'Node.js Backend',
      'Database Design',
      'UI/UX Design',
      'Project Management',
      'Portfolio Development'
    ]
  },
  {
    id: '4',
    title: 'Certificate in Cloud Computing',
    subtitle: 'Professional certificate program',
    description: 'A professional certificate program covering cloud platforms, architecture, and deployment strategies.',
    duration: '6 months',
    credits: 18,
    level: 'Certificate',
    format: 'Online',
    price: 3500,
    thumbnailUrl: '/api/placeholder/400/250',
    university: 'Kalpla University',
    accreditation: 'Industry Recognized',
    startDate: '2024-03-01',
    applicationDeadline: '2024-02-15',
    requirements: [
      'Basic programming knowledge',
      'Computer science background preferred',
      'Personal statement'
    ],
    curriculum: [
      'Cloud Fundamentals',
      'AWS Services',
      'Azure Platform',
      'Google Cloud',
      'DevOps Practices',
      'Security and Compliance',
      'Cost Optimization',
      'Capstone Project'
    ]
  }
];

const levels = ['All', 'Certificate', 'Associate', 'Bachelor\'s', 'Master\'s'];
const formats = ['All', 'Online', 'Hybrid', 'On-Campus'];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Degree Programs</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Earn accredited degrees and certificates that are recognized by employers worldwide. 
            Choose from our comprehensive range of programs designed for career advancement.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-gray-600">Programs Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Job Placement Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
            <div className="text-gray-600">Graduates</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Accredited Programs</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {formats.map((format) => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Durations</option>
                <option value="6months">6 months</option>
                <option value="1year">1 year</option>
                <option value="2years">2 years</option>
                <option value="4years">4 years</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search programs..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {programs.map((program) => (
            <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={program.thumbnailUrl}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                    {program.level}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-600 mb-2">{program.subtitle}</p>
                    <p className="text-sm text-gray-500">{program.university}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">${program.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total cost</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{program.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2 text-gray-600">{program.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Credits:</span>
                    <span className="ml-2 text-gray-600">{program.credits}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Format:</span>
                    <span className="ml-2 text-gray-600">{program.format}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Start Date:</span>
                    <span className="ml-2 text-gray-600">{program.startDate}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Key Topics:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {program.curriculum.slice(0, 3).map((topic) => (
                      <span key={topic} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                    {program.curriculum.length > 3 && (
                      <span className="text-xs text-gray-500">+{program.curriculum.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button asChild className="flex-1">
                    <Link href={`/programs/${program.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/programs/apply">Apply Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Advance Your Career?</h2>
          <p className="text-xl mb-8">
            Join thousands of students who have transformed their careers with our accredited programs.
          </p>
          <div className="space-x-4">
            <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/programs/apply">Apply Today</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/contact">Speak with Advisor</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
