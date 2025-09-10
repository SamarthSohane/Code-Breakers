'use server';

import { findTopRatedVets } from '@/ai/flows/find-top-rated-vets';
import { z } from 'zod';

const FindVetsInputSchema = z.object({
  location: z.string(),
});

type ServerActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function findTopRatedVetsAction(
  input: z.infer<typeof FindVetsInputSchema>
): Promise<ServerActionResult<Awaited<ReturnType<typeof findTopRatedVets>>>> {
  try {
    const validatedInput = FindVetsInputSchema.parse(input);
    const vets = await findTopRatedVets(validatedInput);
    return { success: true, data: vets };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, error: 'Invalid input.' };
    }
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}
