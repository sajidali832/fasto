'use client';

import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

// This is a placeholder page for email verification.
// In a real app, you would likely use Clerk's built-in email verification flow.
// This component demonstrates how you might build a custom UI for it.
export default function VerifyEmailPage() {
  const { isLoaded } = useSignUp();
  const router = useRouter();
  const { toast } = useToast();

  if (!isLoaded) {
    return null;
  }
  
  // This is a simplified example. A real implementation would involve handling codes.
  const handleVerification = () => {
    toast({ title: 'Verification successful!', description: 'Redirecting to your dashboard.' });
    router.push('/');
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="glass-card w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>We've sent a verification link to your email address. Please click the link to continue.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-center text-sm text-muted-foreground">
             Once verified, you will be automatically redirected.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
