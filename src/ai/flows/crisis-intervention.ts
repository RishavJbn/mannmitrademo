'use server';

/**
 * @fileOverview Detects trigger words in user input and determines if the user should be redirected to the helpline.
 *
 * - crisisIntervention - A function that checks for trigger words and returns a boolean indicating if redirection is needed.
 * - CrisisInterventionInput - The input type for the crisisIntervention function.
 * - CrisisInterventionOutput - The return type for the crisisIntervention function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrisisInterventionInputSchema = z.object({
  userInput: z
    .string()
    .describe('The latest user input to check for crisis triggers.'),
  conversationHistory: z
    .string()
    .describe('The past messages to provide context.'),
});
export type CrisisInterventionInput = z.infer<typeof CrisisInterventionInputSchema>;

const CrisisInterventionOutputSchema = z.object({
  shouldRedirect: z
    .boolean()
    .describe(
      'A boolean value indicating whether the user should be redirected to the helpline/counselor page. Should be true if the user expresses thoughts of suicide or self-harm.'
    ),
});
export type CrisisInterventionOutput = z.infer<typeof CrisisInterventionOutputSchema>;

export async function crisisIntervention(input: CrisisInterventionInput): Promise<CrisisInterventionOutput> {
  return crisisInterventionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crisisInterventionPrompt',
  input: {schema: CrisisInterventionInputSchema},
  output: {schema: CrisisInterventionOutputSchema},
  prompt: `You are a mental health support chatbot. Your task is to analyze user input and conversation history to determine if the user is in crisis and needs immediate redirection to a helpline or counselor.

  Here's the latest user input:
  {{userInput}}

  Here's the conversation history:
  {{conversationHistory}}

  Based on the user input and conversation history, determine if the user is expressing thoughts of suicide, self-harm, or is in immediate danger. Return true if redirection is needed, false otherwise.
  Strictly adhere to the output schema.
  `, // Ensure the prompt is clear and concise
});

const crisisInterventionFlow = ai.defineFlow(
  {
    name: 'crisisInterventionFlow',
    inputSchema: CrisisInterventionInputSchema,
    outputSchema: CrisisInterventionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
