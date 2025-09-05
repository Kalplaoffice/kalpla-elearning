'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import '@/lib/amplify-config';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
