
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";

const API_URL = process.env.API_URL;

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Aquí podrías agregar cabeceras de autenticación si fueran necesarias
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    // Intenta parsear el error del cuerpo de la respuesta si es posible
    const errorData = await response.json().catch(() => ({ message: 'Error fetching data' }));
    console.error(`API Error: ${response.statusText}`, errorData);
    throw new Error(errorData.message || 'An error occurred while fetching data.');
  }

  // El backend parece devolver 'text/plain' para respuestas vacías en DELETE
  const text = await response.text();
  if (!text) {
    return null as T;
  }
  
  return JSON.parse(text) as T;
}

export { fetchAPI };
