
import type { Propiedad } from "@/types/interfaces"; // Ajusta esta ruta si es necesario
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { fetchAPI } from "./api-client";

const API_ENDPOINT = '/api/propiedad';

export const propiedadService = {
  getAll(): Promise<BodyListResponse<Propiedad>> {
    return fetchAPI<BodyListResponse<Propiedad>>(API_ENDPOINT);
  },

  save(data: Propiedad): Promise<BodyResponse<Propiedad>> {
    return fetchAPI<BodyResponse<Propiedad>>(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number | string): Promise<BodyResponse<Propiedad>> {
    return fetchAPI<BodyResponse<Propiedad>>(`${API_ENDPOINT}/${id}`);
  },

  delete(id: number | string): Promise<BodyResponse<Propiedad>> {
    return fetchAPI<BodyResponse<Propiedad>>(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
};
