'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock assignment data
const mockAssignments = [
  {
    id: 1,
    title: 'React Portfolio Project',
    course: 'Full-Stack Web Development',
    type: 'Project',
    dueDate: '2024-02-15',
    submissions: 45,
    graded: 32,
    averageScore: 85,
    status: 'Active',
    createdAt: '2024-01-15',
    instructor: 'Sarah Chen'
  },
  {
    id: 2,
    title: 'Machine Learning Model Implementation',
    course: 'AI & Machine Learning',
    type: 'Coding Assignment',
    dueDate: '2024-02-20',
    submissions: 28,
    graded: 15,
    averageScore: 78,
    status: 'Active',
    createdAt: '2024-01-10',
    instructor: 'Dr. Alex Kumar'
  },
  {
    id: 3,
    title: 'Marketing Strategy Quiz',
    course: 'Digital Marketing Mastery',
    type: 'Quiz',
    dueDate: '2024-02-10',
    submissions: 120,
    graded: 120,
    averageScore: 92,
    status: 'Completed',
    createdAt: '2024-01-05',
    instructor: 'Priya Sharma'
  }
];

const mockSubmissions = [
  {
    id: 1,
    studentName: 'Rahul Kumar',
    studentEmail: 'rahul@example.com',
    assignmentTitle: 'React Portfolio Project',
    submittedAt: '2024-02-14',
    status: 'Pending',
    score: null,
    fileUrl: 'portfolio-project.zip'
  },
  {
    id: 2,
    studentName: 'Priya Patel',
    studentEmail: 'priya@example.com',
    assignmentTitle: 'React Portfolio Project',
    submittedAt: '2024-02-13',
    status: 'Graded',
    score: 88,
    fileUrl: 'portfolio-project.zip'
  },
  {
    id: 3,
    studentName: 'Arjun Singh',
    studentEmail: 'arjun@example.com',
    assignmentTitle: 'Machine Learning Model Implementation',
    submittedAt: '2024-02-12',
    status: 'Needs Work',
    score: 65,
    fileUrl: 'ml-model.py'
  }
];

const typeOptions = ['All', 'Project', 'Quiz', 'Coding Assignment', 'Essay', 'Presentation'];
const statusOptions = ['All', 'Active', 'Completed', 'Draft'];
const submissionStatusOptions = ['All', 'Pending', 'Graded', 'Needs Work'];

export default function AssignmentManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSubmissionStatus, setSelectedSubmissionStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('assignments');
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState<number[]>([]);

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || assignment.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || assignment.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedSubmissionStatus === 'All' || submission.status === selectedSubmissionStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectAssignment = (assignmentId: number) => {
    setSelectedAssignments(prev => 
      prev.includes(assignmentId) 
        ? prev.filter(id => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssignments.length === filteredAssignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(filteredAssignments.map(assignment => assignment.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on assignments:`, selectedAssignments);
    // Implement bulk actions here
  };

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
                <p className="text-gray-600">Create, manage, and grade assignments and assessments</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setShowCreateAssignment(true)}
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90 text-white"
                >
                  Create New Assignment
                </Button>
                <Button variant="outline">
                  Import Assignments
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'assignments'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Assignments ({filteredAssignments.length})
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'submissions'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Submissions ({filteredSubmissions.length})
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reports'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reports & Analytics
                </button>
              </nav>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-[#2C4E41]">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <Input
                    type="text"
                    placeholder="Search assignments or students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {typeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'assignments' ? 'Status' : 'Submission Status'}
                  </label>
                  <select
                    value={activeTab === 'assignments' ? selectedStatus : selectedSubmissionStatus}
                    onChange={(e) => {
                      if (activeTab === 'assignments') {
                        setSelectedStatus(e.target.value);
                      } else {
                        setSelectedSubmissionStatus(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {(activeTab === 'assignments' ? statusOptions : submissionStatusOptions).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('All');
                      setSelectedStatus('All');
                      setSelectedSubmissionStatus('All');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <>
              {/* Bulk Actions */}
              {selectedAssignments.length > 0 && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {selectedAssignments.length} assignment(s) selected
                        </span>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkAction('publish')}
                          >
                            Publish
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkAction('archive')}
                          >
                            Archive
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkAction('export')}
                          >
                            Export Selected
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkAction('delete')}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAssignments([])}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Assignments List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-[#2C4E41]">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.course}</CardDescription>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedAssignments.includes(assignment.id)}
                          onChange={() => handleSelectAssignment(assignment.id)}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{assignment.type}</Badge>
                        <Badge variant={assignment.status === 'Active' ? 'default' : 'outline'}>
                          {assignment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Instructor:</span>
                          <span className="font-medium">{assignment.instructor}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium">{assignment.dueDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Submissions:</span>
                          <span className="font-medium">{assignment.submissions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Graded:</span>
                          <span className="font-medium">{assignment.graded}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Average Score:</span>
                          <span className="font-medium text-[#2C4E41]">{assignment.averageScore}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Grade
                        </Button>
                        <Button size="sm" variant="outline">
                          ⋮
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Recent Submissions</CardTitle>
                <CardDescription>Review and grade student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Assignment</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{submission.studentName}</div>
                              <div className="text-sm text-gray-500">{submission.studentEmail}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{submission.assignmentTitle}</td>
                          <td className="py-3 px-4 text-gray-900">{submission.submittedAt}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={submission.status === 'Graded' ? 'default' : 
                                     submission.status === 'Pending' ? 'outline' : 'destructive'}
                            >
                              {submission.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {submission.score ? (
                              <span className="font-medium text-[#2C4E41]">{submission.score}%</span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                Grade
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">{mockAssignments.length}</div>
                  <p className="text-sm text-gray-600">Total Assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">
                    {mockSubmissions.length}
                  </div>
                  <p className="text-sm text-gray-600">Total Submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">
                    {Math.round(mockSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / mockSubmissions.filter(s => s.score).length)}%
                  </div>
                  <p className="text-sm text-gray-600">Average Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">
                    {mockSubmissions.filter(s => s.status === 'Pending').length}
                  </div>
                  <p className="text-sm text-gray-600">Pending Grading</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feature List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assignments & Assessments Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Create/Manage Assignments', description: 'Design and organize student assignments', status: 'active' },
                { title: 'Auto/Manual Grading System', description: 'Flexible grading options for different assignment types', status: 'active' },
                { title: 'Approve/Reject Submissions', description: 'Review and manage student submissions', status: 'active' },
                { title: 'Give Feedback on Assignments', description: 'Provide detailed feedback to students', status: 'active' },
                { title: 'Track Student Progress', description: 'Monitor assignment completion and performance', status: 'active' },
                { title: 'Upload Quizzes/Tests', description: 'Create MCQs, subjective, and coding assessments', status: 'active' },
                { title: 'Auto-evaluate MCQs', description: 'Automatic grading for multiple choice questions', status: 'active' },
                { title: 'Generate Report Cards', description: 'Create comprehensive progress reports', status: 'active' },
                { title: 'Leaderboard Scoring', description: 'Rank students based on assignment performance', status: 'active' },
                { title: 'Export Grades/Reports', description: 'Download grades and reports in various formats', status: 'active' }
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                      <Badge variant={feature.status === 'active' ? 'default' : 'outline'}>
                        {feature.status}
                      </Badge>
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
