"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself"
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 }
];

export default function TestPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const router = useRouter();

  const handleValueChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: parseInt(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);

    // Scoring Categories: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe.
    if (totalScore >= 15) {
      router.push('/helpline');
    } else {
      router.push('/chatbot');
    }
  };

  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / questions.length) * 100;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Wellness Check-in</h1>
        <p className="text-muted-foreground mt-2">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={index} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{`Question ${index + 1}`}</CardTitle>
                <CardDescription className="text-base pt-2 text-foreground">{question}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => handleValueChange(index, value)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {options.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(option.value)} id={`q${index}-o${option.value}`} />
                      <Label htmlFor={`q${index}-o${option.value}`} className="cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8">
          <Progress value={progress} className="mb-4" />
          <Button type="submit" disabled={answeredQuestions < questions.length} className="w-full" size="lg">
            See My Results
          </Button>
          {answeredQuestions < questions.length && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Please answer all {questions.length} questions to proceed.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
