'use server';

import { getCommonInjuries } from '@/ai/flows/get-common-injuries';
import { getFirstAidGuide } from '@/ai/flows/get-first-aid-guide';
import { z } from 'zod';

const GetInjuriesSchema = z.object({
  animal: z.string(),
});

const GetGuideSchema = z.object({
    animal: z.string(),
    injury: z.string(),
});

type ServerActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function getCommonInjuriesAction(
  input: z.infer<typeof GetInjuriesSchema>
): Promise<ServerActionResult<Awaited<ReturnType<typeof getCommonInjuries>>>> {
  try {
    const validatedInput = GetInjuriesSchema.parse(input);
    const result = await getCommonInjuries(validatedInput);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { success: false, error };
  }
}

export async function getFirstAidGuideAction(
    input: z.infer<typeof GetGuideSchema>
): Promise<ServerActionResult<Awaited<ReturnType<typeof getFirstAidGuide>>>> {
    try {
      const validatedInput = GetGuideSchema.parse(input);
      const result = await getFirstAidGuide(validatedInput);
      return { success: true, data: result };
    } catch (e) {
      console.error(e);
      const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
      return { success: false, error };
    }
  }
