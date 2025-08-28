
import type { TipoUsuarioAplicacion } from "@/types/interfaces"; // Ajusta esta ruta si es necesario
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { fetchAPI } from "./api-client";

const API_ENDPOINT = '/api/tipo-usuario-aplicacion';

export const tipoUsuarioAplicacionService = {
  getAll(): Promise<BodyListResponse<TipoUsuarioAplicacion>> {
    return fetchAPI<BodyListResponse<TipoUsuarioAplicacion>>(API_ENDPOINT);
  },

  save(data: TipoUsuarioAplicacion): Promise<BodyResponse<TipoUsuarioAplicacion>> {
    return fetchAPI<BodyResponse<TipoUsuarioAplicacion>>(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number | string): Promise<BodyResponse<TipoUsuarioAplicacion>> {
    return fetchAPI<BodyResponse<TipoUsuarioAplicacion>>(`${API_ENDPOINT}/${id}`);
  },

  delete(id: number | string): Promise<BodyResponse<TipoUsuarioAplicacion>> {
    return fetchAPI<BodyResponse<TipoUsuarioAplicacion>>(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
};
