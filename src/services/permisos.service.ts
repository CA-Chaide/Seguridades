
import type { Permisos } from "@/types/interfaces"; // Ajusta esta ruta si es necesario
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { fetchAPI } from "./api-client";

const API_ENDPOINT = '/api/permisos';

export const permisosService = {
  getAll(): Promise<BodyListResponse<Permisos>> {
    return fetchAPI<BodyListResponse<Permisos>>(API_ENDPOINT);
  },

  save(data: Permisos): Promise<BodyResponse<Permisos>> {
    return fetchAPI<BodyResponse<Permisos>>(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number | string): Promise<BodyResponse<Permisos>> {
    return fetchAPI<BodyResponse<Permisos>>(`${API_ENDPOINT}/${id}`);
  },

  delete(id: number | string): Promise<BodyResponse<Permisos>> {
    return fetchAPI<BodyResponse<Permisos>>(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
};
