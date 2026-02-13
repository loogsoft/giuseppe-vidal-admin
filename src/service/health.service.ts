import api from "./api";

const API_URL = "/health";
export const HealthService = {
  health: async (): Promise<unknown> => {
    const response = await api.get<unknown>(API_URL);
    return response.data;
  },
};