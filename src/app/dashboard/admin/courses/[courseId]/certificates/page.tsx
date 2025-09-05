'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock certificate data - replace with actual GraphQL queries
const mockCourse = {
  id: '1',
  title: 'Complete Web Development Bootcamp',
  totalStudents: 1250,
  eligibleStudents: 150,
  certificatesIssued: 120,
  pendingApprovals: 30
};

const mockCertificates = [
  {
    id: '1',
    student: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/api/placeholder/40/40'
    },
    completionDate: '2024-01-25',
    grade: 95,
    status: 'issued',
    certificateUrl: '/api/placeholder/certificate1.pdf',
    issuedDate: '2024-01-26',
    issuedBy: 'Sarah Johnson',
    verificationCode: 'KALP-WEB-2024-001'
  },
  {
    id: '2',
    student: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: '/api/placeholder/40/40'
    },
    completionDate: '2024-01-28',
    grade: 88,
    status: 'pending',
    certificateUrl: null,
    issuedDate: null,
    issuedBy: null,
    verificationCode: null
  },
  {
    id: '3',
    student: {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      avatar: '/api/placeholder/40/40'
    },
    completionDate: '2024-01-30',
    grade: 92,
    status: 'issued',
    certificateUrl: '/api/placeholder/certificate3.pdf',
    issuedDate: '2024-01-31',
    issuedBy: 'Sarah Johnson',
    verificationCode: 'KALP-WEB-2024-003'
  },
  {
    id: '4',
    student: {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      avatar: '/api/placeholder/40/40'
    },
    completionDate: '2024-02-02',
    grade: 85,
    status: 'rejected',
    certificateUrl: null,
    issuedDate: null,
    issuedBy: null,
    verificationCode: null,
    rejectionReason: 'Grade below minimum requirement (90%)'
  }
];

export default function CourseCertificatesPage({ params }: { params: { courseId: string } }) {
  const { user } = useAuth();
  const [course, setCourse] = useState(mockCourse);
  const [certificates, setCertificates] = useState(mockCertificates);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate loading certificate data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.courseId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = certificate.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || certificate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectCertificate = (certificateId: string) => {
    const newSelected = new Set(selectedCertificates);
    if (newSelected.has(certificateId)) {
      newSelected.delete(certificateId);
    } else {
      newSelected.add(certificateId);
    }
    setSelectedCertificates(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCertificates.size === filteredCertificates.length) {
      setSelectedCertificates(new Set());
    } else {
      setSelectedCertificates(new Set(filteredCertificates.map(c => c.id)));
    }
  };

  const handleBulkApprove = () => {
    // TODO: Implement bulk approval logic
    console.log('Approving certificates:', Array.from(selectedCertificates));
    setSelectedCertificates(new Set());
    setShowBulkActions(false);
  };

  const handleBulkReject = () => {
    // TODO: Implement bulk rejection logic
    console.log('Rejecting certificates:', Array.from(selectedCertificates));
    setSelectedCertificates(new Set());
    setShowBulkActions(false);
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Admin']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF804B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading certificates...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Course Certificates</h1>
                <p className="text-gray-600">{course.title}</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  variant="outline"
                >
                  Bulk Actions
                </Button>
                <Link href={`/dashboard/admin/courses/${params.courseId}`}>
                  <Button variant="outline">Back to Course</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-[#FF804B]">{course.totalStudents}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">{course.eligibleStudents}</div>
                <div className="text-sm text-gray-600">Eligible for Certificate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">{course.certificatesIssued}</div>
                <div className="text-sm text-gray-600">Certificates Issued</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-yellow-600">{course.pendingApprovals}</div>
                <div className="text-sm text-gray-600">Pending Approval</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="issued">Issued</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {showBulkActions && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedCertificates.size === filteredCertificates.length && filteredCertificates.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#FF804B] focus:ring-[#FF804B]"
                    />
                    <span className="text-sm text-gray-700">
                      {selectedCertificates.size} of {filteredCertificates.length} selected
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleBulkApprove}
                      disabled={selectedCertificates.size === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve Selected
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleBulkReject}
                      disabled={selectedCertificates.size === 0}
                      variant="outline"
                    >
                      Reject Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificates Table */}
          <Card>
            <CardHeader>
              <CardTitle>Certificate Requests ({filteredCertificates.length})</CardTitle>
              <CardDescription>
                Review and manage certificate requests for course completion
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {showBulkActions && (
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedCertificates.size === filteredCertificates.length && filteredCertificates.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-[#FF804B] focus:ring-[#FF804B]"
                          />
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completion Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verification Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCertificates.map((certificate) => (
                      <tr key={certificate.id} className="hover:bg-gray-50">
                        {showBulkActions && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedCertificates.has(certificate.id)}
                              onChange={() => handleSelectCertificate(certificate.id)}
                              className="rounded border-gray-300 text-[#FF804B] focus:ring-[#FF804B]"
                            />
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={certificate.student.avatar}
                              alt={certificate.student.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {certificate.student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {certificate.student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(certificate.completionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              certificate.grade >= 90 ? 'text-green-600' : 
                              certificate.grade >= 80 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {certificate.grade}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(certificate.status)}>
                            {certificate.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {certificate.verificationCode || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {certificate.status === 'pending' && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline">
                                  Reject
                                </Button>
                              </>
                            )}
                            {certificate.status === 'issued' && (
                              <Button size="sm" variant="outline">
                                View Certificate
                              </Button>
                            )}
                            {certificate.status === 'rejected' && (
                              <Button size="sm" variant="outline">
                                View Reason
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {filteredCertificates.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No students have completed this course yet.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
