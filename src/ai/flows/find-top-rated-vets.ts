'use server';
/**
 * @fileOverview An AI agent to find top-rated veterinarians in a user's neighborhood.
 *
 * - findTopRatedVets - A function that takes a user's location and returns a list of top-rated vets.
 * - FindTopRatedVetsInput - The input type for the findTopRatedVets function.
 * - FindTopRatedVetsOutput - The return type for the findTopRatedVets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindTopRatedVetsInputSchema = z.object({
  location: z
    .string()
    .describe('The user provided location to search for veterinarians near.'),
});
export type FindTopRatedVetsInput = z.infer<typeof FindTopRatedVetsInputSchema>;

const VeterinarianSchema = z.object({
  name: z.string().describe('The name of the veterinarian.'),
  address: z.string().describe('The address of the veterinarian.'),
  rating: z.number().describe('The rating of the veterinarian (1-5).'),
  phone_number: z.string().describe('The phone number of the veterinarian.'),
  distance: z.string().describe("The distance of the veterinarian from the user's location."),
  fees: z.string().describe('The consultation fees for the veterinarian.'),
  opening_hours: z.string().describe('The opening and closing times for the veterinarian.'),
  image: z.string().describe('A URL for a picture of the veterinarian clinic.'),
});

const FindTopRatedVetsOutputSchema = z.array(VeterinarianSchema).describe('A list of top-rated veterinarians.');
export type FindTopRatedVetsOutput = z.infer<typeof FindTopRatedVetsOutputSchema>;

export async function findTopRatedVets(input: FindTopRatedVetsInput): Promise<FindTopRatedVetsOutput> {
  return findTopRatedVetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findTopRatedVetsPrompt',
  input: {schema: FindTopRatedVetsInputSchema},
  output: {schema: FindTopRatedVetsOutputSchema},
  prompt: `You are a helpful AI assistant. Find the top-rated veterinarians near the user's location. Return a list of vets including their name, address, rating, phone number, distance from user, consultation fees, opening and closing hours, and a representative image URL for the clinic.\n\nLocation: {{{location}}}`,
});

const findTopRatedVetsFlow = ai.defineFlow(
  {
    name: 'findTopRatedVetsFlow',
    inputSchema: FindTopRatedVetsInputSchema,
    outputSchema: FindTopRatedVetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
