"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { KeyRound, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock Login Logic: In a real app, you'd find the user by this phrase from a DB.
    // For this prototype, we'll just check if it matches what might be in localStorage
    // or just pretend it works and redirect.
    
    try {
        const storedUser = localStorage.getItem('anubhooti-user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if(user.recoveryPhrase === recoveryPhrase.trim()) {
                toast({
                    title: "Login Successful",
                    description: "Welcome back!",
                });
                router.push('/home');
            } else {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "The recovery phrase is incorrect. Please try again.",
                });
            }
        } else {
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: "No user account found on this device. Please register first.",
             });
        }
    } catch(err) {
        toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: "Could not process login. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">Welcome Back</h1>
        <p className="text-muted-foreground mt-2 text-lg">Access your anonymous space securely.</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle>Account Login</CardTitle>
            <CardDescription>
              Enter your secret recovery phrase to log in. This is case-sensitive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recovery-phrase" className="flex items-center gap-2"><KeyRound className="h-4 w-4"/>Secret Recovery Phrase</Label>
              <Input
                id="recovery-phrase"
                value={recoveryPhrase}
                onChange={(e) => setRecoveryPhrase(e.target.value)}
                placeholder="Enter your 12-word phrase..."
                required
                className="font-mono text-sm"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Log In'}
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <p>Don't have an ID? <Link href="/register" className="underline text-primary">Register Here</Link></p>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
