"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const { user } = useAuth();
  const calmIllustration = PlaceHolderImages.find(p => p.id === 'home-calm-illustration');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center md:text-left mb-12">
        <h1 className="text-4xl font-bold text-foreground font-headline">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your space for peace and reflection.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="text-primary" />
                <span>Wellness Check-in</span>
              </CardTitle>
              <CardDescription>
                Take a moment to understand your current emotional state with the PHQ-9 questionnaire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/test">
                <Button>
                  <span>Start the Test</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="text-primary" />
                <span>AI Companion</span>
              </CardTitle>
              <CardDescription>
                Chat with our supportive AI for guidance, coping strategies, or just to talk.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chatbot">
                <Button>
                  <span>Chat Now</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="hidden md:block">
          {calmIllustration && (
            <Image
              src={calmIllustration.imageUrl}
              alt={calmIllustration.description}
              width={600}
              height={450}
              className="rounded-lg object-cover shadow-2xl"
              data-ai-hint={calmIllustration.imageHint}
            />
          )}
        </div>
      </div>
    </div>
  );
}
