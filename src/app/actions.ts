
'use server';

import { suggestRoleAssignments, type SuggestRoleAssignmentsInput } from '@/ai/flows/suggest-role-assignments';
import { redirect } from 'next/navigation';
import { authService } from '@/services/auth.service';

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
    const usuario = formData.get('email') as string;
    const contrasena = formData.get('password') as string;

    console.log("Intentando iniciar sesión con Usuario: ", usuario);

    if (!usuario || !contrasena) {
      return { success: false, message: 'El email y la contraseña son obligatorios.' };
    }

    try {
        const response = await authService.login({ usuario, contrasena });
        console.log('Respuesta de la API:', response);
        // Asumiendo que una respuesta exitosa no lanza error
        return { success: true, message: 'Inicio de sesión exitoso.' };
    } catch (error) {
        console.error('Error de inicio de sesión:', error);
        const message = error instanceof Error ? error.message : 'Error desconocido.';
        return { success: false, message };
    }
}
