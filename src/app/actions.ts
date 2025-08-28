'use server';

import { suggestRoleAssignments, type SuggestRoleAssignmentsInput } from '@/ai/flows/suggest-role-assignments';

export async function getRoleSuggestions(input: SuggestRoleAssignmentsInput) {
  try {
    const result = await suggestRoleAssignments(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
