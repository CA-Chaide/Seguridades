
import type { Usuario } from "@/types/interfaces"; // Ajusta esta ruta si es necesario
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { fetchAPI } from "./api-client";

const API_ENDPOINT = '/api/usuario';

export const usuarioService = {
  getAll(): Promise<BodyListResponse<Usuario>> {
    return fetchAPI<BodyListResponse<Usuario>>(API_ENDPOINT);
  },

  save(data: Usuario): Promise<BodyResponse<Usuario>> {
    return fetchAPI<BodyResponse<Usuario>>(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number | string): Promise<BodyResponse<Usuario>> {
    return fetchAPI<BodyResponse<Usuario>>(`${API_ENDPOINT}/${id}`);
  },

  delete(id: number | string): Promise<BodyResponse<Usuario>> {
    return fetchAPI<BodyResponse<Usuario>>(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
};
