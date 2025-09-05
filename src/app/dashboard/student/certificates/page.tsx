'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock certificates data - replace with actual GraphQL queries
const certificates = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    course: 'Complete Web Development Bootcamp',
    instructor: 'Sarah Johnson',
    issuedDate: '2024-01-10',
    verificationCode: 'KAL-JS-2024-001',
    downloadUrl: '/certificates/js-fundamentals.pdf',
    verificationUrl: '/verify/KAL-JS-2024-001',
    thumbnailUrl: '/api/placeholder/300/200',
    description: 'This certificate verifies successful completion of JavaScript Fundamentals module covering variables, functions, objects, and DOM manipulation.',
    skills: ['JavaScript', 'ES6', 'DOM Manipulation', 'Functions', 'Objects'],
    grade: 92,
    hours: 15,
    isVerified: true
  },
  {
    id: '2',
    title: 'Data Analysis with Python',
    course: 'Data Science with Python',
    instructor: 'Michael Chen',
    issuedDate: '2024-01-05',
    verificationCode: 'KAL-DS-2024-002',
    downloadUrl: '/certificates/data-analysis.pdf',
    verificationUrl: '/verify/KAL-DS-2024-002',
    thumbnailUrl: '/api/placeholder/300/200',
    description: 'Certificate of completion for Data Analysis with Python covering Pandas, NumPy, Matplotlib, and statistical analysis.',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Data Analysis'],
    grade: 88,
    hours: 20,
    isVerified: true
  },
  {
    id: '3',
    title: 'AWS Cloud Practitioner',
    course: 'AWS Cloud Practitioner',
    instructor: 'Emily Rodriguez',
    issuedDate: '2024-01-01',
    verificationCode: 'KAL-AWS-2024-003',
    downloadUrl: '/certificates/aws-practitioner.pdf',
    verificationUrl: '/verify/KAL-AWS-2024-003',
    thumbnailUrl: '/api/placeholder/300/200',
    description: 'AWS Cloud Practitioner certificate demonstrating understanding of cloud concepts, services, security, and billing.',
    skills: ['AWS', 'Cloud Computing', 'EC2', 'S3', 'Cloud Security'],
    grade: 95,
    hours: 25,
    isVerified: true
  },
  {
    id: '4',
    title: 'React Development',
    course: 'Complete Web Development Bootcamp',
    instructor: 'Sarah Johnson',
    issuedDate: '2024-01-08',
    verificationCode: 'KAL-REACT-2024-004',
    downloadUrl: '/certificates/react-development.pdf',
    verificationUrl: '/verify/KAL-REACT-2024-004',
    thumbnailUrl: '/api/placeholder/300/200',
    description: 'React Development certificate covering components, hooks, state management, and modern React patterns.',
    skills: ['React', 'JSX', 'Hooks', 'State Management', 'Components'],
    grade: 90,
    hours: 18,
    isVerified: true
  }
];

const upcomingCertificates = [
  {
    id: '5',
    title: 'Node.js Backend Development',
    course: 'Complete Web Development Bootcamp',
    progress: 85,
    requirements: [
      'Complete all Node.js modules',
      'Submit final project',
      'Pass the assessment with 80%+'
    ],
    estimatedCompletion: '2024-01-25'
  },
  {
    id: '6',
    title: 'Machine Learning Fundamentals',
    course: 'Data Science with Python',
    progress: 60,
    requirements: [
      'Complete ML modules',
      'Build ML project',
      'Pass the final exam'
    ],
    estimatedCompletion: '2024-02-15'
  }
];

const certificateStats = {
  totalCertificates: certificates.length,
  totalHours: certificates.reduce((sum, cert) => sum + cert.hours, 0),
  averageGrade: Math.round(certificates.reduce((sum, cert) => sum + cert.grade, 0) / certificates.length),
  thisYear: certificates.filter(cert => cert.issuedDate.startsWith('2024')).length
};

const categories = [
  { id: 'all', label: 'All Certificates', count: certificates.length },
  { id: 'web-dev', label: 'Web Development', count: certificates.filter(c => c.course.includes('Web')).length },
  { id: 'data-science', label: 'Data Science', count: certificates.filter(c => c.course.includes('Data')).length },
  { id: 'aws', label: 'AWS', count: certificates.filter(c => c.course.includes('AWS')).length }
];

export default function CertificatesPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const groups = session.tokens?.idToken?.payload['cognito:groups'] as string[] || [];
        
        setUser(currentUser);
        setIsAuthorized(groups.includes('Student') || groups.includes('Admin'));
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredCertificates = certificates.filter(certificate => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'web-dev') return certificate.course.includes('Web');
    if (selectedCategory === 'data-science') return certificate.course.includes('Data');
    if (selectedCategory === 'aws') return certificate.course.includes('AWS');
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
          <p className="text-gray-600">View and manage your earned certificates</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">{certificateStats.totalCertificates}</div>
              <div className="text-gray-600">Total Certificates</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600 mb-2">{certificateStats.totalHours}h</div>
              <div className="text-gray-600">Learning Hours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">{certificateStats.averageGrade}%</div>
              <div className="text-gray-600">Average Grade</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600 mb-2">{certificateStats.thisYear}</div>
              <div className="text-gray-600">This Year</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-full"
            >
              {category.label}
              {category.count > 0 && (
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {category.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCertificate(certificate)}>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <img
                  src={certificate.thumbnailUrl}
                  alt={certificate.title}
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🏆</div>
                    <div className="text-lg font-bold">{certificate.title}</div>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                    {certificate.grade}%
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{certificate.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{certificate.course}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Issued: {certificate.issuedDate}</span>
                  <span>{certificate.hours}h</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    View Certificate
                  </Button>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Certificates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Certificates</CardTitle>
            <CardDescription>Certificates you're working towards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingCertificates.map((cert) => (
                <div key={cert.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{cert.title}</h4>
                    <span className="text-sm text-gray-600">{cert.progress}% complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${cert.progress}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Estimated completion: {cert.estimatedCompletion}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Requirements:</div>
                    <ul className="space-y-1">
                      {cert.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certificate Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedCertificate.title}</CardTitle>
                    <CardDescription>{selectedCertificate.course}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCertificate(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏆</div>
                      <div className="text-2xl font-bold">{selectedCertificate.title}</div>
                      <div className="text-lg opacity-80">{selectedCertificate.course}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Certificate Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Verification Code:</span>
                          <span className="font-mono">{selectedCertificate.verificationCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issued Date:</span>
                          <span>{selectedCertificate.issuedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Instructor:</span>
                          <span>{selectedCertificate.instructor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grade:</span>
                          <span>{selectedCertificate.grade}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span>{selectedCertificate.hours} hours</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Skills Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCertificate.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedCertificate.description}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button asChild className="flex-1">
                      <a href={selectedCertificate.downloadUrl} download>
                        Download PDF
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <a href={selectedCertificate.verificationUrl} target="_blank" rel="noopener noreferrer">
                        Verify Certificate
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
