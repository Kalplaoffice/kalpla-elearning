import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const mentorshipFeatures = [
  {
    title: '1-on-1 Mentorship',
    description: 'Get personalized guidance from industry experts who understand your career goals and challenges.',
    icon: '👥'
  },
  {
    title: 'Career Guidance',
    description: 'Receive expert advice on career planning, job search strategies, and professional development.',
    icon: '🎯'
  },
  {
    title: 'Project Reviews',
    description: 'Get detailed feedback on your projects and code to improve your technical skills.',
    icon: '📝'
  },
  {
    title: 'Industry Networking',
    description: 'Connect with professionals in your field and expand your professional network.',
    icon: '🌐'
  },
  {
    title: 'Job Placement Support',
    description: 'Get help with resume building, interview preparation, and job placement assistance.',
    icon: '💼'
  },
  {
    title: 'Exclusive Events',
    description: 'Access to mentorship events, workshops, and networking opportunities.',
    icon: '🎉'
  }
];

const mentors = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer at Google',
    experience: '10+ years',
    expertise: ['React', 'Node.js', 'System Design'],
    avatar: '/api/placeholder/100/100',
    bio: 'Passionate about helping developers grow their careers and technical skills.',
    rating: 4.9,
    students: 150
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Data Science Lead at Microsoft',
    experience: '8+ years',
    expertise: ['Python', 'Machine Learning', 'Data Engineering'],
    avatar: '/api/placeholder/100/100',
    bio: 'Expert in data science and machine learning with a focus on real-world applications.',
    rating: 4.8,
    students: 120
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Cloud Architect at AWS',
    experience: '12+ years',
    expertise: ['AWS', 'DevOps', 'Cloud Architecture'],
    avatar: '/api/placeholder/100/100',
    bio: 'Specializes in cloud computing and helps students build scalable applications.',
    rating: 4.9,
    students: 180
  }
];

const programStructure = [
  {
    month: 'Months 1-3',
    title: 'Foundation Building',
    description: 'Establish your learning goals, assess current skills, and create a personalized learning plan.',
    activities: [
      'Initial assessment and goal setting',
      'Personalized learning roadmap',
      'Weekly 1-on-1 sessions',
      'Skill gap analysis'
    ]
  },
  {
    month: 'Months 4-6',
    title: 'Skill Development',
    description: 'Focus on building technical skills through guided projects and hands-on learning.',
    activities: [
      'Project-based learning',
      'Code reviews and feedback',
      'Technical skill workshops',
      'Industry best practices'
    ]
  },
  {
    month: 'Months 7-9',
    title: 'Portfolio Building',
    description: 'Create a strong portfolio of projects that showcase your skills to potential employers.',
    activities: [
      'Portfolio project development',
      'GitHub profile optimization',
      'Technical writing practice',
      'Open source contributions'
    ]
  },
  {
    month: 'Months 10-12',
    title: 'Career Transition',
    description: 'Prepare for job interviews and career advancement with targeted support.',
    activities: [
      'Interview preparation',
      'Resume and LinkedIn optimization',
      'Job search strategy',
      'Salary negotiation training'
    ]
  }
];

const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'Software Developer at TechCorp',
    content: 'The mentorship program completely transformed my career. My mentor helped me land my dream job in just 8 months!',
    rating: 5
  },
  {
    name: 'Maria Garcia',
    role: 'Data Scientist at DataFlow',
    content: 'The personalized guidance and project feedback were invaluable. I went from beginner to job-ready in one year.',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Cloud Engineer at CloudTech',
    content: 'The networking opportunities and industry insights helped me understand what employers really want.',
    rating: 5
  }
];

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">12-Month Mentorship Program</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Get personalized guidance from industry experts and accelerate your career in technology. 
            Our comprehensive mentorship program pairs you with experienced professionals for 12 months of intensive learning and growth.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/mentorship/apply">Apply Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link href="#program-details">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorshipFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Program Structure */}
      <div id="program-details" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Program Structure</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {programStructure.map((phase, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-blue-600 text-white p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-2">{phase.month}</div>
                        <div className="text-blue-100">{phase.title}</div>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <h3 className="text-xl font-semibold mb-3">{phase.title}</h3>
                      <p className="text-gray-600 mb-4">{phase.description}</p>
                      <ul className="space-y-2">
                        {phase.activities.map((activity, activityIndex) => (
                          <li key={activityIndex} className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Your Mentors</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{mentor.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{mentor.title}</p>
                  <p className="text-sm text-gray-600 mb-4">{mentor.experience} experience</p>
                  <p className="text-gray-600 text-sm mb-4">{mentor.bio}</p>
                  <div className="mb-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {mentor.expertise.map((skill) => (
                        <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {mentor.rating}
                    </div>
                    <div>{mentor.students} students</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Program Pricing</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle>Standard Program</CardTitle>
                  <CardDescription>Perfect for most students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">$2,999</div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Monthly 1-on-1 sessions
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Project reviews and feedback
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Career guidance
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Access to exclusive events
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Job placement support
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/mentorship/apply">Choose Standard</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <CardHeader>
                  <CardTitle>Premium Program</CardTitle>
                  <CardDescription>Maximum support and resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">$4,999</div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Bi-weekly 1-on-1 sessions
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Unlimited project reviews
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Priority career guidance
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      VIP access to all events
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Guaranteed job placement assistance
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Resume and LinkedIn optimization
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Mock interviews
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/mentorship/apply">Choose Premium</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of students who have successfully transitioned into tech careers 
            with our mentorship program.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/mentorship/apply">Apply Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/contact">Speak with Advisor</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
