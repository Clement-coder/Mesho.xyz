'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/** Returns a guard function. Call it before any action that requires auth.
 *  If not authenticated, redirects to /signup and returns false. */
export function useAuthGuard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (): boolean => {
    if (!isAuthenticated) {
      toast.error('Please create an account or sign in to continue.', {
        action: { label: 'Sign Up', onClick: () => router.push('/signup') },
        duration: 5000,
      });
      router.push('/signup');
      return false;
    }
    return true;
  };
}
