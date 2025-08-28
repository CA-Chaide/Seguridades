
import type { MenuTipoUsuario } from "@/types/interfaces"; // Ajusta esta ruta si es necesario
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { fetchAPI } from "./api-client";

const API_ENDPOINT = '/api/menu-tipo-usuario';

export const menuTipoUsuarioService = {
  getAll(): Promise<BodyListResponse<MenuTipoUsuario>> {
    return fetchAPI<BodyListResponse<MenuTipoUsuario>>(API_ENDPOINT);
  },

  save(data: MenuTipoUsuario): Promise<BodyResponse<MenuTipoUsuario>> {
    return fetchAPI<BodyResponse<MenuTipoUsuario>>(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number | string): Promise<BodyResponse<MenuTipoUsuario>> {
    return fetchAPI<BodyResponse<MenuTipoUsuario>>(`${API_ENDPOINT}/${id}`);
  },

  delete(id: number | string): Promise<BodyResponse<MenuTipoUsuario>> {
    return fetchAPI<BodyResponse<MenuTipoUsuario>>(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
};
