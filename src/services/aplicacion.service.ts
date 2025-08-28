
import type { Aplicacion } from "@/types/interfaces"; // Ajusta esta ruta si es necesario
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { fetchAPI } from "./api-client";

const API_ENDPOINT = '/api/aplicacion';

export const aplicacionService = {
  getAll(): Promise<BodyListResponse<Aplicacion>> {
    return fetchAPI<BodyListResponse<Aplicacion>>(API_ENDPOINT);
  },

  save(data: Aplicacion): Promise<BodyResponse<Aplicacion>> {
    return fetchAPI<BodyResponse<Aplicacion>>(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number | string): Promise<BodyResponse<Aplicacion>> {
    return fetchAPI<BodyResponse<Aplicacion>>(`${API_ENDPOINT}/${id}`);
  },

  delete(id: number | string): Promise<BodyResponse<Aplicacion>> {
    return fetchAPI<BodyResponse<Aplicacion>>(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
};
