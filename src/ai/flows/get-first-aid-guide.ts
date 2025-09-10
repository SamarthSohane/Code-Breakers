'use server';
/**
 * @fileOverview An AI agent to get a first-aid guide for a specific animal injury.
 *
 * - getFirstAidGuide - A function that provides a step-by-step first-aid guide.
 * - GetFirstAidGuideInput - The input type for the getFirstAidGuide function.
 * - GetFirstAidGuideOutput - The return type for the getFirstAidGuide function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetFirstAidGuideInputSchema = z.object({
  animal: z.string().describe('The type of animal.'),
  injury: z.string().describe('The specific injury or ailment.'),
});
export type GetFirstAidGuideInput = z.infer<typeof GetFirstAidGuideInputSchema>;

const GetFirstAidGuideOutputSchema = z.object({
    guide: z.string().describe('A step-by-step first-aid guide to treat the injury at home. The guide should be formatted as a single string with steps clearly marked (e.g., using markdown for numbered lists). Include a clear disclaimer advising the user to consult a veterinarian for serious issues.'),
});
export type GetFirstAidGuideOutput = z.infer<typeof GetFirstAidGuideOutputSchema>;


export async function getFirstAidGuide(input: GetFirstAidGuideInput): Promise<GetFirstAidGuideOutput> {
    return getFirstAidGuideFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getFirstAidGuidePrompt',
    input: { schema: GetFirstAidGuideInputSchema },
    output: { schema: GetFirstAidGuideOutputSchema },
    prompt: `You are an expert veterinarian writing a first-aid guide for a pet owner.
Generate a simple, easy-to-follow, step-by-step guide for treating a '{{{injury}}}' in a {{{animal}}}.
The guide should be practical for at-home care.
Start the guide with a title.
Use markdown for formatting, including numbered lists for the steps.
IMPORTANT: Conclude the guide with a clear, bolded disclaimer: "**Disclaimer: This guide is for informational purposes only. For any serious or persistent conditions, please consult a licensed veterinarian immediately.**"`,
});

const getFirstAidGuideFlow = ai.defineFlow(
    {
        name: 'getFirstAidGuideFlow',
        inputSchema: GetFirstAidGuideInputSchema,
        outputSchema: GetFirstAidGuideOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
