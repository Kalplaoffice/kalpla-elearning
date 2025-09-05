import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardContent className="p-12">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#KAL-2024-001234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">Credit Card ending in 1234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">$5,198.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">January 15, 2024</span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Check your email</p>
                    <p className="text-sm text-gray-600">You'll receive a confirmation email with your order details and access instructions.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Access your courses</p>
                    <p className="text-sm text-gray-600">Log in to your account and start learning immediately.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Join the community</p>
                    <p className="text-sm text-gray-600">Connect with other students and get support from our community.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <Link href="/dashboard/student">Go to Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/courses">Browse More Courses</Link>
                </Button>
              </div>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                Need help? Our support team is here to assist you.
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <a href="mailto:support@kalpla.com" className="hover:text-blue-600">
                  support@kalpla.com
                </a>
                <a href="tel:+1-555-123-4567" className="hover:text-blue-600">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
