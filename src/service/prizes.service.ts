import type { PrizeRequestDto } from "../dtos/request/prize-request.dto";
import api from "./api";

export const PrizesService = {
  async create(data: PrizeRequestDto) {
    const response = await api.post("/prizes", data);
    return response.data;
  },

  async findAll() {
    const response = await api.get("/prizes");
    return response.data;
  },

  async findOne(id: string) {
    const response = await api.get(`/prizes/${id}`);
    return response.data;
  },

  async update(id: string, data: PrizeRequestDto) {
    const response = await api.patch(`/prizes/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/prizes/${id}`);
  },
};
