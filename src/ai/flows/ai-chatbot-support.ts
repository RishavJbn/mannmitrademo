'use server';

/**
 * @fileOverview An AI chatbot to provide mental health support.
 *
 * - aiChatbotSupport - A function that handles the chatbot interaction.
 * - AIChatbotSupportInput - The input type for the aiChatbotSupport function.
 * - AIChatbotSupportOutput - The return type for the aiChatbotSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotSupportInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  history: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).optional().describe('The conversation history between the user and the bot.'),
});
export type AIChatbotSupportInput = z.infer<typeof AIChatbotSupportInputSchema>;

const AIChatbotSupportOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
  redirect: z.string().optional().describe('URL to redirect to if trigger words are detected'),
});
export type AIChatbotSupportOutput = z.infer<typeof AIChatbotSupportOutputSchema>;

const triggerWords = ['suicide', 'self-harm', 'crisis', 'kill myself', 'end my life'];

export async function aiChatbotSupport(input: AIChatbotSupportInput): Promise<AIChatbotSupportOutput> {
  return aiChatbotSupportFlow(input);
}

const aiChatbotSupportPrompt = ai.definePrompt({
  name: 'aiChatbotSupportPrompt',
  input: {
    schema: AIChatbotSupportInputSchema,
  },
  output: {
    schema: AIChatbotSupportOutputSchema,
  },
  prompt: `You are a mental health support chatbot for college students. Provide coping strategies, breathing exercises, and journaling prompts.

  Be concise. Respond in under 100 words.

  If the user expresses thoughts of suicide, self-harm, or is in crisis, set the redirect field to '/helpline'. Otherwise leave it blank.

  Here's the previous conversation history:
  {{#each history}}
  {{#ifEquals role "user"}}User: {{content}}{{/ifEquals}}
  {{#ifEquals role "bot"}}Bot: {{content}}{{/ifEquals}}
  {{/each}}

  User: {{{message}}}
  Chatbot: `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

ai.Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  // @ts-expect-error
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

const aiChatbotSupportFlow = ai.defineFlow({
    name: 'aiChatbotSupportFlow',
    inputSchema: AIChatbotSupportInputSchema,
    outputSchema: AIChatbotSupportOutputSchema,
  },
  async input => {
    // Check for trigger words in the input message
    const lowerCaseMessage = input.message.toLowerCase();
    const shouldRedirect = triggerWords.some(word => lowerCaseMessage.includes(word));

    const {output} = await aiChatbotSupportPrompt({
      ...input,
      redirect: shouldRedirect ? '/helpline' : undefined,
    });

    return {
      ...output,
      redirect: shouldRedirect ? '/helpline' : output?.redirect,
    };
  });
