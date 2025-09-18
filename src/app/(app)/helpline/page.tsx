"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Phone, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const helplines = [
  { name: "KIRAN Mental Health Helpline", number: "1800-599-0019", description: "A national helpline by the Govt. of India for mental health support." },
  { name: "Snehi", number: "011-65978181", description: "Provides emotional support to those who are distressed, depressed or suicidal." },
  { name: "Vandrevala Foundation", number: "9999666555", description: "24/7 helpline providing counseling and support for mental wellness." },
];

export default function HelplinePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleBookSlot = () => {
    if (date) {
      toast({
        title: "Booking Confirmed (Mock)",
        description: `Your counseling session is booked for ${format(date, 'PPP')}.`,
        duration: 5000,
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-headline text-destructive">Immediate Support</h1>
        <p className="text-muted-foreground mt-2 text-lg">You are not alone. Help is available. Please reach out.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="shadow-lg border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Phone className="text-destructive" />
                <span>National Helplines</span>
              </CardTitle>
              <CardDescription>
                These services are free, confidential, and available 24/7.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {helplines.map((helpline) => (
                <div key={helpline.name} className="p-3 bg-muted rounded-lg">
                  <h3 className="font-semibold">{helpline.name}</h3>
                  <p className="text-sm text-muted-foreground">{helpline.description}</p>
                  <a href={`tel:${helpline.number}`} className="block mt-2">
                    <Button variant="destructive" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Call {helpline.number}
                    </Button>
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CalendarIcon />
                <span>Book a Counselor (Mock)</span>
              </CardTitle>
              <CardDescription>
                Schedule a free, confidential session with a professional counselor. Select a date below.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
              />
              <Button onClick={handleBookSlot} disabled={!date} className="mt-4 w-full">
                <Clock className="mr-2 h-4 w-4" />
                Confirm Booking for {date ? format(date, 'PPP') : '...'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
