
import type { Auth, Usuario } from "@/types/interfaces";
import type { BodyResponse } from "@/types/body-response";
import { environment } from "@/environments/environments.prod";

const API_URL = `${environment.apiURL}/api/auths/login`;

// Define a type for the login credentials
type LoginCredentials = {
  usuario: string;
  contrasena: string;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<BodyResponse<Auth>> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error al iniciar sesión. Por favor, inténtelo de nuevo.' }));
      throw new Error(errorBody.message || 'Ocurrió un error desconocido.');
    }
    
    return response.json();
  },
};
