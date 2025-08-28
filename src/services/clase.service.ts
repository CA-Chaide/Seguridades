
import type { Clase } from "@/types/interfaces"; // Ajusta esta ruta si es necesario
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { fetchAPI } from "./api-client";

const API_ENDPOINT = '/api/clase';

export const claseService = {
  getAll(): Promise<BodyListResponse<Clase>> {
    return fetchAPI<BodyListResponse<Clase>>(API_ENDPOINT);
  },

  save(data: Clase): Promise<BodyResponse<Clase>> {
    return fetchAPI<BodyResponse<Clase>>(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number | string): Promise<BodyResponse<Clase>> {
    return fetchAPI<BodyResponse<Clase>>(`${API_ENDPOINT}/${id}`);
  },

  delete(id: number | string): Promise<BodyResponse<Clase>> {
    return fetchAPI<BodyResponse<Clase>>(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
};
