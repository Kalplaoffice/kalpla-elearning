'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import '@/lib/amplify-config';
import { useEffect, useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render children, but only wrap with AuthProvider after mount
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
