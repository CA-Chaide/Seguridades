
import type { Menu } from "@/types/interfaces"; // Ajusta esta ruta si es necesario
import type { BodyListResponse } from "@/types/body-list-response";
import type { BodyResponse } from "@/types/body-response";
import { fetchAPI } from "./api-client";

const API_ENDPOINT = '/api/menu';

export const menuService = {
  getAll(): Promise<BodyListResponse<Menu>> {
    return fetchAPI<BodyListResponse<Menu>>(API_ENDPOINT);
  },

  save(data: Menu): Promise<BodyResponse<Menu>> {
    return fetchAPI<BodyResponse<Menu>>(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number | string): Promise<BodyResponse<Menu>> {
    return fetchAPI<BodyResponse<Menu>>(`${API_ENDPOINT}/${id}`);
  },

  delete(id: number | string): Promise<BodyResponse<Menu>> {
    return fetchAPI<BodyResponse<Menu>>(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
};
