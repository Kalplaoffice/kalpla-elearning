import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProgramDetailPageProps {
  params: {
    programId: string;
  };
}

// Mock program data - replace with actual GraphQL queries
const program = {
  id: '1',
  title: 'Bachelor of Science in Computer Science',
  subtitle: 'Comprehensive 4-year degree program',
  description: 'A comprehensive computer science degree program covering programming, algorithms, data structures, software engineering, and more. This program prepares students for careers in software development, data science, cybersecurity, and other technology fields.',
  longDescription: `
    <p>The Bachelor of Science in Computer Science at Kalpla University is designed to provide students with a solid foundation in computer science principles and practical skills needed for success in the technology industry.</p>
    
    <p>Our curriculum combines theoretical knowledge with hands-on experience, ensuring graduates are well-prepared for the challenges of modern software development. Students will learn programming languages, software engineering practices, database design, computer networks, and much more.</p>
    
    <p>The program includes a capstone project where students work on real-world problems, often in collaboration with industry partners. This provides valuable experience and networking opportunities that can lead to job offers upon graduation.</p>
  `,
  duration: '4 years',
  credits: 120,
  level: 'Bachelor\'s',
  format: 'Online + Hybrid',
  price: 25000,
  thumbnailUrl: '/api/placeholder/800/400',
  university: 'Kalpla University',
  accreditation: 'Accredited by ABET',
  startDate: '2024-09-01',
  applicationDeadline: '2024-07-15',
  requirements: [
    'High school diploma or equivalent',
    'SAT/ACT scores (optional)',
    'Personal statement (500-1000 words)',
    'Two letters of recommendation',
    'Official transcripts',
    'English proficiency test (for international students)'
  ],
  curriculum: [
    {
      year: 1,
      semester: 'Fall',
      courses: [
        'Introduction to Programming',
        'Mathematics for Computer Science',
        'Introduction to Computer Science',
        'English Composition',
        'General Education Elective'
      ]
    },
    {
      year: 1,
      semester: 'Spring',
      courses: [
        'Data Structures and Algorithms',
        'Discrete Mathematics',
        'Computer Organization',
        'Statistics',
        'General Education Elective'
      ]
    },
    {
      year: 2,
      semester: 'Fall',
      courses: [
        'Object-Oriented Programming',
        'Database Systems',
        'Computer Networks',
        'Linear Algebra',
        'General Education Elective'
      ]
    },
    {
      year: 2,
      semester: 'Spring',
      courses: [
        'Software Engineering',
        'Operating Systems',
        'Web Development',
        'Probability and Statistics',
        'General Education Elective'
      ]
    },
    {
      year: 3,
      semester: 'Fall',
      courses: [
        'Machine Learning',
        'Computer Graphics',
        'Cybersecurity Fundamentals',
        'Technical Writing',
        'General Education Elective'
      ]
    },
    {
      year: 3,
      semester: 'Spring',
      courses: [
        'Artificial Intelligence',
        'Mobile App Development',
        'Cloud Computing',
        'Ethics in Computing',
        'General Education Elective'
      ]
    },
    {
      year: 4,
      semester: 'Fall',
      courses: [
        'Advanced Algorithms',
        'Software Architecture',
        'Computer Science Elective',
        'General Education Elective',
        'General Education Elective'
      ]
    },
    {
      year: 4,
      semester: 'Spring',
      courses: [
        'Capstone Project',
        'Computer Science Elective',
        'Computer Science Elective',
        'General Education Elective',
        'General Education Elective'
      ]
    }
  ],
  careerOutcomes: [
    'Software Developer',
    'Data Scientist',
    'Cybersecurity Analyst',
    'Web Developer',
    'Mobile App Developer',
    'Systems Analyst',
    'Database Administrator',
    'IT Project Manager'
  ],
  salaryRange: {
    entry: 65000,
    mid: 95000,
    senior: 130000
  },
  jobPlacementRate: 95,
  averageTimeToJob: '3 months'
};

const relatedPrograms = [
  {
    id: '2',
    title: 'Master of Science in Data Science',
    level: 'Master\'s',
    duration: '2 years',
    price: 18000,
    thumbnailUrl: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Associate Degree in Web Development',
    level: 'Associate',
    duration: '2 years',
    price: 12000,
    thumbnailUrl: '/api/placeholder/300/200'
  }
];

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-white/20 text-white px-3 py-1 rounded text-sm font-medium">
                {program.level}
              </span>
              <span className="text-white/80">{program.university}</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">{program.title}</h1>
            <p className="text-xl mb-8">{program.subtitle}</p>
            <div className="flex items-center space-x-8 text-lg">
              <div>
                <span className="font-medium">Duration:</span> {program.duration}
              </div>
              <div>
                <span className="font-medium">Credits:</span> {program.credits}
              </div>
              <div>
                <span className="font-medium">Format:</span> {program.format}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Program Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Program Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: program.longDescription }} />
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle>Curriculum</CardTitle>
                <CardDescription>Complete course structure over {program.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {program.curriculum.map((semester, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Year {semester.year} - {semester.semester}
                      </h4>
                      <ul className="space-y-1">
                        {semester.courses.map((course, courseIndex) => (
                          <li key={courseIndex} className="text-gray-600 text-sm">
                            • {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle>Career Outcomes</CardTitle>
                <CardDescription>What you can do with this degree</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Career Paths</h4>
                    <ul className="space-y-2">
                      {program.careerOutcomes.map((career, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          {career}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Salary Range</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entry Level:</span>
                        <span className="font-medium">${program.salaryRange.entry.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mid Career:</span>
                        <span className="font-medium">${program.salaryRange.mid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Senior Level:</span>
                        <span className="font-medium">${program.salaryRange.senior.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-800">
                        <strong>{program.jobPlacementRate}%</strong> job placement rate
                      </div>
                      <div className="text-sm text-green-600">
                        Average time to job: {program.averageTimeToJob}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card>
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
                <CardDescription>Start your application today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ${program.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total program cost</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{program.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Deadline:</span>
                    <span className="font-medium text-red-600">{program.applicationDeadline}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/programs/apply">Apply Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request Information
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {program.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Accreditation */}
            <Card>
              <CardHeader>
                <CardTitle>Accreditation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">✓</span>
                  </div>
                  <p className="font-medium text-gray-900">{program.accreditation}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    This program meets the highest standards of quality and is recognized by employers worldwide.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Related Programs */}
            <Card>
              <CardHeader>
                <CardTitle>Related Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedPrograms.map((relatedProgram) => (
                    <div key={relatedProgram.id} className="flex items-center space-x-3">
                      <img
                        src={relatedProgram.thumbnailUrl}
                        alt={relatedProgram.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                          {relatedProgram.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {relatedProgram.level} • {relatedProgram.duration}
                        </p>
                        <p className="text-xs font-medium text-blue-600">
                          ${relatedProgram.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
