
import type { Usuario } from "@/types/interfaces";
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { environment } from "@/environments/environments.prod";

const API_URL = `${environment.apiURL}/api/usuarios`;

export const usuarioService = {
  async getAll(): Promise<BodyListResponse<Usuario>> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorBody.message || 'Failed to fetch usuarios');
    }
    return response.json();
  },

  async getById(id: number | string): Promise<BodyResponse<Usuario>> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorBody.message || `Failed to fetch usuario with id ${id}`);
    }
    return response.json();
  },

  async save(data: Usuario): Promise<BodyResponse<Usuario>> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorBody.message || 'Failed to save usuario');
    }
    return response.json();
  },

  async delete(id: number | string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorBody.message || `Failed to delete usuario with id ${id}`);
    }
  },

  async getFichasPersonas(): Promise<BodyResponse<any>> {
    const response = await fetch(`${API_URL}/fichasUsuarios`);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorBody.message || `Failed to fetch fichas for usuarios`);
    }
    return response.json();
  },

  async getPerfilesUsuario(data: string): Promise<BodyResponse<any>> {
    const response = await fetch(`${API_URL}/usuarioByCodigoEmpleadoRT`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({codigo_empleado : data}),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorBody.message || 'Failed to save usuario');
    }
    return response.json();
  },

};
