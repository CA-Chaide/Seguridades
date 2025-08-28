
import type { TipoPermiso } from "@/types/interfaces"; // Ajusta esta ruta si es necesario
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { fetchAPI } from "./api-client";

const API_ENDPOINT = '/api/tipo-permiso';

export const tipoPermisoService = {
  getAll(): Promise<BodyListResponse<TipoPermiso>> {
    return fetchAPI<BodyListResponse<TipoPermiso>>(API_ENDPOINT);
  },

  save(data: TipoPermiso): Promise<BodyResponse<TipoPermiso>> {
    return fetchAPI<BodyResponse<TipoPermiso>>(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number | string): Promise<BodyResponse<TipoPermiso>> {
    return fetchAPI<BodyResponse<TipoPermiso>>(`${API_ENDPOINT}/${id}`);
  },

  delete(id: number | string): Promise<BodyResponse<TipoPermiso>> {
    return fetchAPI<BodyResponse<TipoPermiso>>(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
};
