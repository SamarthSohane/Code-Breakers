'use server';
/**
 * @fileOverview An AI agent to get a list of common injuries for a given animal.
 *
 * - getCommonInjuries - A function that takes an animal type and returns a list of common injuries.
 * - GetCommonInjuriesInput - The input type for the getCommonInjuries function.
 * - GetCommonInjuriesOutput - The return type for the getCommonInjuries function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetCommonInjuriesInputSchema = z.object({
  animal: z.string().describe('The type of animal.'),
});
export type GetCommonInjuriesInput = z.infer<typeof GetCommonInjuriesInputSchema>;

const GetCommonInjuriesOutputSchema = z.object({
    injuries: z.array(z.string()).describe('A list of common injuries for the specified animal.'),
});
export type GetCommonInjuriesOutput = z.infer<typeof GetCommonInjuriesOutputSchema>;

export async function getCommonInjuries(input: GetCommonInjuriesInput): Promise<GetCommonInjuriesOutput> {
    return getCommonInjuriesFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getCommonInjuriesPrompt',
    input: { schema: GetCommonInjuriesInputSchema },
    output: { schema: GetCommonInjuriesOutputSchema },
    prompt: `You are a veterinary assistant. Provide a list of 5-7 common, non-critical injuries or ailments for a {{{animal}}} that a pet owner might be able to address with first aid at home. Focus on issues like minor cuts, insect bites, or mild digestive upset. Do not include severe or life-threatening conditions.`,
});

const getCommonInjuriesFlow = ai.defineFlow(
    {
        name: 'getCommonInjuriesFlow',
        inputSchema: GetCommonInjuriesInputSchema,
        outputSchema: GetCommonInjuriesOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
