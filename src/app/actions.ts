
'use server';

import { suggestRoleAssignments, type SuggestRoleAssignmentsInput } from '@/ai/flows/suggest-role-assignments';
import { redirect } from 'next/navigation';

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

export async function login(previousState: any, formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');

    if (username === 'admin' && password === 'admin') {
        return { success: true, message: 'Login successful' };
    }

    return { success: false, message: 'Usuario o contraseña incorrectos.' };
}
