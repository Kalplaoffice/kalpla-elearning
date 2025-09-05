'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Mock payment data
const mockTransactions = [
  {
    id: 1,
    studentName: 'Priya Sharma',
    studentEmail: 'priya@example.com',
    course: 'Full-Stack Web Development',
    amount: 299,
    paymentMethod: 'Razorpay',
    status: 'Completed',
    transactionId: 'TXN_123456789',
    date: '2024-01-20',
    refundAmount: 0,
    commission: 29.9
  },
  {
    id: 2,
    studentName: 'Rahul Kumar',
    studentEmail: 'rahul@example.com',
    course: 'AI & Machine Learning',
    amount: 399,
    paymentMethod: 'UPI',
    status: 'Completed',
    transactionId: 'TXN_987654321',
    date: '2024-01-19',
    refundAmount: 0,
    commission: 39.9
  },
  {
    id: 3,
    studentName: 'Arjun Singh',
    studentEmail: 'arjun@example.com',
    course: 'Digital Marketing Mastery',
    amount: 199,
    paymentMethod: 'Credit Card',
    status: 'Refunded',
    transactionId: 'TXN_456789123',
    date: '2024-01-18',
    refundAmount: 199,
    commission: 0
  },
  {
    id: 4,
    studentName: 'Sarah Chen',
    studentEmail: 'sarah@example.com',
    course: 'Startup MBA Program',
    amount: 25000,
    paymentMethod: 'EMI',
    status: 'Pending',
    transactionId: 'TXN_789123456',
    date: '2024-01-17',
    refundAmount: 0,
    commission: 2500
  }
];

const mockPromoCodes = [
  {
    id: 1,
    code: 'WELCOME20',
    description: '20% off for new students',
    discountType: 'Percentage',
    discountValue: 20,
    maxUses: 100,
    usedCount: 45,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    status: 'Active'
  },
  {
    id: 2,
    code: 'STUDENT50',
    description: '₹50 off for students',
    discountType: 'Fixed',
    discountValue: 50,
    maxUses: 500,
    usedCount: 120,
    validFrom: '2024-01-15',
    validUntil: '2024-06-30',
    status: 'Active'
  },
  {
    id: 3,
    code: 'EARLYBIRD',
    description: 'Early bird discount',
    discountType: 'Percentage',
    discountValue: 15,
    maxUses: 50,
    usedCount: 50,
    validFrom: '2023-12-01',
    validUntil: '2024-01-31',
    status: 'Expired'
  }
];

const mockInstructors = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    courses: 3,
    totalEarnings: 45000,
    commissionRate: 10,
    pendingPayout: 5000,
    lastPayout: '2024-01-15'
  },
  {
    id: 2,
    name: 'Dr. Alex Kumar',
    email: 'alex@example.com',
    courses: 2,
    totalEarnings: 32000,
    commissionRate: 12,
    pendingPayout: 3500,
    lastPayout: '2024-01-10'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    courses: 1,
    totalEarnings: 15000,
    commissionRate: 8,
    pendingPayout: 2000,
    lastPayout: '2024-01-05'
  }
];

const paymentStatusOptions = ['All', 'Completed', 'Pending', 'Failed', 'Refunded'];
const paymentMethodOptions = ['All', 'Razorpay', 'UPI', 'Credit Card', 'EMI', 'Bank Transfer'];

export default function PaymentManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [activeTab, setActiveTab] = useState('transactions');
  const [showCreatePromo, setShowCreatePromo] = useState(false);
  const [showProcessPayout, setShowProcessPayout] = useState(false);

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || transaction.status === selectedStatus;
    const matchesMethod = selectedMethod === 'All' || transaction.paymentMethod === selectedMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalRevenue = mockTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = mockTransactions
    .reduce((sum, t) => sum + t.refundAmount, 0);

  const netRevenue = totalRevenue - totalRefunds;

  const totalCommission = mockTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.commission, 0);

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
                <p className="text-gray-600">Handle financial transactions and reporting</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setShowCreatePromo(true)}
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90 text-white"
                >
                  Create Promo Code
                </Button>
                <Button 
                  onClick={() => setShowProcessPayout(true)}
                  variant="outline"
                >
                  Process Payouts
                </Button>
                <Button variant="outline">
                  Export Data
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
                  onClick={() => setActiveTab('transactions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'transactions'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Transactions ({filteredTransactions.length})
                </button>
                <button
                  onClick={() => setActiveTab('promocodes')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'promocodes'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Promo Codes ({mockPromoCodes.length})
                </button>
                <button
                  onClick={() => setActiveTab('instructors')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'instructors'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Instructor Payouts ({mockInstructors.length})
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reports'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Financial Reports
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
                    placeholder="Search transactions, students, or courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {paymentStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {paymentMethodOptions.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStatus('All');
                      setSelectedMethod('All');
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

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Payment Transactions</CardTitle>
                <CardDescription>View and manage all payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Course</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{transaction.studentName}</div>
                              <div className="text-sm text-gray-500">{transaction.studentEmail}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{transaction.course}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-[#2C4E41]">₹{transaction.amount.toLocaleString()}</div>
                            {transaction.refundAmount > 0 && (
                              <div className="text-sm text-red-600">Refunded: ₹{transaction.refundAmount}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-900">{transaction.paymentMethod}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={transaction.status === 'Completed' ? 'default' : 
                                     transaction.status === 'Pending' ? 'outline' : 
                                     transaction.status === 'Refunded' ? 'destructive' : 'outline'}
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{transaction.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              {transaction.status === 'Completed' && (
                                <Button size="sm" variant="outline" className="text-red-600">
                                  Refund
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
          )}

          {/* Promo Codes Tab */}
          {activeTab === 'promocodes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPromoCodes.map((promo) => (
                <Card key={promo.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-[#2C4E41]">{promo.code}</CardTitle>
                        <CardDescription>{promo.description}</CardDescription>
                      </div>
                      <Badge variant={promo.status === 'Active' ? 'default' : 'outline'}>
                        {promo.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium">
                          {promo.discountType === 'Percentage' ? `${promo.discountValue}%` : `₹${promo.discountValue}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Uses:</span>
                        <span className="font-medium">{promo.usedCount}/{promo.maxUses}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Valid Until:</span>
                        <span className="font-medium">{promo.validUntil}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Instructor Payouts Tab */}
          {activeTab === 'instructors' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Instructor Payouts</CardTitle>
                <CardDescription>Manage instructor commissions and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Instructor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Courses</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Total Earnings</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Commission Rate</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Pending Payout</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Last Payout</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInstructors.map((instructor) => (
                        <tr key={instructor.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{instructor.name}</div>
                              <div className="text-sm text-gray-500">{instructor.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{instructor.courses}</td>
                          <td className="py-3 px-4 font-medium text-[#2C4E41]">₹{instructor.totalEarnings.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-900">{instructor.commissionRate}%</td>
                          <td className="py-3 px-4 font-medium text-[#FF804B]">₹{instructor.pendingPayout.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-900">{instructor.lastPayout}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                Process Payout
                              </Button>
                              <Button size="sm" variant="outline">
                                View Details
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
                  <div className="text-2xl font-bold text-[#2C4E41]">₹{totalRevenue.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">₹{netRevenue.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Net Revenue</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">₹{totalRefunds.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Total Refunds</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">₹{totalCommission.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Total Commission</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feature List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payments & Finance Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Manage Payments (View/Refund)', description: 'Handle all payment transactions', status: 'active' },
                { title: 'Approve/Reject EMI Requests', description: 'Process installment payment requests', status: 'active' },
                { title: 'Track Revenue by Program/Course', description: 'Detailed revenue analytics', status: 'active' },
                { title: 'Manage Discounts & Promo Codes', description: 'Create and manage promotional offers', status: 'active' },
                { title: 'Issue Invoices/Receipts', description: 'Automatic invoice generation', status: 'active' },
                { title: 'Generate Financial Reports', description: 'Comprehensive financial reporting', status: 'active' },
                { title: 'Connect Payment Gateways', description: 'Razorpay/Stripe integration', status: 'active' },
                { title: 'Set Commission Rates', description: 'Configure instructor commission rates', status: 'active' },
                { title: 'Monitor Payment Status', description: 'Track overdue and failed payments', status: 'active' },
                { title: 'Export Payment Data', description: 'CSV/Excel export for accounting', status: 'active' }
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
