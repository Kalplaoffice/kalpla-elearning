'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock payment data - replace with actual GraphQL queries
const transactions = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Complete Web Development Bootcamp',
    amount: 199.99,
    status: 'completed',
    paymentMethod: 'Credit Card ending in 1234',
    invoiceUrl: '/invoices/inv-001.pdf',
    type: 'course'
  },
  {
    id: '2',
    date: '2024-01-10',
    description: '12-Month Mentorship Program - Premium',
    amount: 4999.00,
    status: 'completed',
    paymentMethod: 'Credit Card ending in 1234',
    invoiceUrl: '/invoices/inv-002.pdf',
    type: 'mentorship'
  },
  {
    id: '3',
    date: '2024-01-05',
    description: 'Data Science with Python',
    amount: 249.99,
    status: 'completed',
    paymentMethod: 'PayPal',
    invoiceUrl: '/invoices/inv-003.pdf',
    type: 'course'
  },
  {
    id: '4',
    date: '2024-01-01',
    description: 'AWS Cloud Practitioner',
    amount: 179.99,
    status: 'refunded',
    paymentMethod: 'Credit Card ending in 1234',
    invoiceUrl: '/invoices/inv-004.pdf',
    type: 'course'
  }
];

const activeSubscriptions = [
  {
    id: '1',
    name: '12-Month Mentorship Program - Premium',
    description: 'Premium mentorship with bi-weekly sessions',
    amount: 4999.00,
    billingCycle: 'One-time',
    nextBillingDate: null,
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2025-01-10',
    features: [
      'Bi-weekly 1-on-1 sessions',
      'Unlimited project reviews',
      'Priority career guidance',
      'VIP access to all events',
      'Guaranteed job placement assistance'
    ]
  },
  {
    id: '2',
    name: 'Premium Learning Features',
    description: 'Advanced features and priority support',
    amount: 29.99,
    billingCycle: 'Monthly',
    nextBillingDate: '2024-02-15',
    status: 'active',
    startDate: '2024-01-15',
    endDate: null,
    features: [
      'Priority support',
      'Advanced analytics',
      'Downloadable resources',
      'Mobile app access'
    ]
  }
];

const paymentMethods = [
  {
    id: '1',
    type: 'Credit Card',
    last4: '1234',
    brand: 'Visa',
    expiryMonth: '12',
    expiryYear: '2026',
    isDefault: true
  },
  {
    id: '2',
    type: 'PayPal',
    email: 'user@example.com',
    isDefault: false
  }
];

const refundRequests = [
  {
    id: '1',
    course: 'AWS Cloud Practitioner',
    amount: 179.99,
    requestDate: '2024-01-02',
    status: 'approved',
    reason: 'Course content not as expected',
    processedDate: '2024-01-05',
    refundAmount: 179.99
  }
];

const installmentPlans = [
  {
    id: '1',
    course: 'Complete Web Development Bootcamp',
    totalAmount: 199.99,
    paidAmount: 99.99,
    remainingAmount: 100.00,
    installments: 2,
    paidInstallments: 1,
    nextPaymentDate: '2024-02-15',
    nextPaymentAmount: 50.00,
    status: 'active'
  }
];

export default function PaymentsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');

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
          <p className="mt-4 text-gray-600">Loading payment information...</p>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSpent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter(t => t.status === 'refunded')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments & Subscriptions</h1>
          <p className="text-gray-600">Manage your payments, subscriptions, and billing</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600 mb-2">${totalSpent.toFixed(2)}</div>
              <div className="text-gray-600">Total Spent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">{activeSubscriptions.length}</div>
              <div className="text-gray-600">Active Subscriptions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">{transactions.length}</div>
              <div className="text-gray-600">Total Transactions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600 mb-2">${totalRefunded.toFixed(2)}</div>
              <div className="text-gray-600">Total Refunded</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'transactions', label: 'Transaction History' },
            { id: 'subscriptions', label: 'Active Subscriptions' },
            { id: 'payment-methods', label: 'Payment Methods' },
            { id: 'refunds', label: 'Refunds' },
            { id: 'installments', label: 'Installment Plans' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-full"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'transactions' && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-500' :
                        transaction.status === 'refunded' ? 'bg-gray-500' :
                        'bg-yellow-500'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                        <p className="text-sm text-gray-600">{transaction.paymentMethod}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${transaction.amount.toFixed(2)}</div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            {activeSubscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
                      <p className="text-gray-600">{subscription.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${subscription.amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">{subscription.billingCycle}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Start Date:</span>
                      <span className="ml-2 text-gray-600">{subscription.startDate}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Next Billing:</span>
                      <span className="ml-2 text-gray-600">
                        {subscription.nextBillingDate || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                    <ul className="grid md:grid-cols-2 gap-1 text-sm text-gray-600">
                      {subscription.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Manage Subscription
                    </Button>
                    <Button variant="outline" size="sm">
                      Download Invoice
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'payment-methods' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-lg">💳</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {method.type} {method.last4 && `ending in ${method.last4}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {method.brand && `${method.brand} • `}
                          {method.expiryMonth && method.expiryYear && `Expires ${method.expiryMonth}/${method.expiryYear}`}
                          {method.email && method.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Default
                        </span>
                      )}
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  Add New Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'refunds' && (
          <Card>
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>Track your refund requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {refundRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{request.course}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Amount:</span>
                        <span className="ml-2 text-gray-600">${request.amount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Request Date:</span>
                        <span className="ml-2 text-gray-600">{request.requestDate}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Reason:</span>
                        <span className="ml-2 text-gray-600">{request.reason}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Refund Amount:</span>
                        <span className="ml-2 text-gray-600">${request.refundAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  Request New Refund
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'installments' && (
          <Card>
            <CardHeader>
              <CardTitle>Installment Plans</CardTitle>
              <CardDescription>Track your installment payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {installmentPlans.map((plan) => (
                  <div key={plan.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">{plan.course}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{plan.paidInstallments}/{plan.installments} payments</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(plan.paidInstallments / plan.installments) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Total Amount:</span>
                        <span className="ml-2 text-gray-600">${plan.totalAmount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Paid:</span>
                        <span className="ml-2 text-gray-600">${plan.paidAmount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Remaining:</span>
                        <span className="ml-2 text-gray-600">${plan.remainingAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-blue-900">Next Payment</p>
                          <p className="text-xs text-blue-700">{plan.nextPaymentDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-900">${plan.nextPaymentAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
