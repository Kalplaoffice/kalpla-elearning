'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneAuthFormProps {
  onSuccess?: (phoneNumber: string) => void;
  onError?: (error: string) => void;
  mode: 'signin' | 'signup';
  className?: string;
}

export const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({
  onSuccess,
  onError,
  mode,
  className = ''
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'verification'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For now, we'll simulate the phone verification process
      // In a real implementation, you would call AWS Cognito's sendCustomChallengeAnswer
      // or use a service like AWS SNS to send SMS
      console.log('Sending verification code to:', phoneNumber);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep('verification');
      onSuccess?.(phoneNumber);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
      onError?.(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For now, we'll simulate the verification process
      // In a real implementation, you would call AWS Cognito's confirmSignUp
      // or verify the SMS code
      console.log('Verifying code:', verificationCode);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful verification
      onSuccess?.(phoneNumber);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
      onError?.(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      // Resend verification code
      console.log('Resending verification code to:', phoneNumber);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verification') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Verify Phone Number</CardTitle>
          <CardDescription>
            Enter the verification code sent to {phoneNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                className="w-full"
                maxLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Phone Number'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResendCode}
                disabled={loading}
                className="text-sm"
              >
                Resend Code
              </Button>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setStep('phone')}
                className="text-sm"
              >
                Change Phone Number
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {mode === 'signin' ? 'Sign in with Phone' : 'Sign up with Phone'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Enter your phone number to sign in to your account'
            : 'Enter your phone number to create a new account'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value || '')}
              placeholder="Enter phone number"
              className="phone-input"
              style={{
                '--PhoneInput-color--focus': '#2C4E41',
                '--PhoneInputInternationalIcon-color': '#6B7280',
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send you a verification code via SMS
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !phoneNumber}
          >
            {loading ? 'Sending Code...' : `Send Verification Code`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhoneAuthForm;
