"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Shield, KeyRound, Copy, ArrowRight, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type UserData = {
  name: string;
  id: string;
  recoveryPhrase: string;
} | null;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [generatedData, setGeneratedData] = useState<UserData>(null);
  const [hasSaved, setHasSaved] = useState(false);

  const handleGenerateId = () => {
    const userData = register();
    setGeneratedData(userData);
    setStep(2);
  };

  const handleContinue = () => {
    router.push('/home');
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: `${fieldName} has been copied.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">Anubhooti</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your Anonymous Path to Wellness</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Create Your Anonymous ID</CardTitle>
              <CardDescription>
                We do not require any personal information. Your identity is protected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start p-4 bg-muted rounded-lg">
                <Shield className="h-8 w-8 text-primary mr-4 shrink-0" />
                <div>
                  <h3 className="font-semibold">Complete Anonymity</h3>
                  <p className="text-sm text-muted-foreground">Your conversations and test results are never linked to your real identity.</p>
                </div>
              </div>
              <Button onClick={handleGenerateId} className="w-full" size="lg">
                Generate Secure ID
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
               <div className="text-center text-sm text-muted-foreground">
                <p>Already have an ID? <Link href="/login" className="underline text-primary">Login Here</Link></p>
            </div>
            </CardContent>
          </>
        )}

        {step === 2 && generatedData && (
          <>
            <CardHeader>
              <CardTitle>Save Your Secret Credentials</CardTitle>
              <CardDescription className="text-destructive">
                This is the ONLY way to recover your account. Store it securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="anon-name">Anonymous Name</Label>
                <div className="flex items-center gap-2">
                  <Input id="anon-name" value={generatedData.name} readOnly />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedData.name, 'Name')}><Copy className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="anon-id">Anonymous ID</Label>
                <div className="flex items-center gap-2">
                  <Input id="anon-id" value={generatedData.id} readOnly />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedData.id, 'ID')}><Copy className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recovery-phrase" className="flex items-center gap-2"><KeyRound className="h-4 w-4"/>Secret Recovery Phrase</Label>
                 <div className="flex items-center gap-2">
                  <Input id="recovery-phrase" value={generatedData.recoveryPhrase} readOnly className="font-mono text-sm" />
                   <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedData.recoveryPhrase, 'Phrase')}><Copy className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox id="has-saved" checked={hasSaved} onCheckedChange={(checked) => setHasSaved(checked as boolean)} />
                <label
                  htmlFor="has-saved"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have securely saved my credentials.
                </label>
              </div>

              <Button onClick={handleContinue} className="w-full" size="lg" disabled={!hasSaved}>
                Continue to App
                <UserCheck className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
