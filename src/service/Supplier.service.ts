import type {
  SupplierRequestDto,
  SupplierStatus,
} from "../dtos/request/supplier-request.dto";
import type { SupplierResponseDto } from "../dtos/response/supplier-response.dto";
import api from "./api";

const API_URL = "/suppliers";

type SupplierListResponse =
  | SupplierResponseDto[]
  | { data: SupplierResponseDto[] };

export const SupplierService = {
  findAll: async (): Promise<SupplierListResponse> => {
    const response = await api.get<SupplierListResponse>(API_URL);
    return response.data;
  },

  findOne: async (id: string): Promise<SupplierResponseDto> => {
    const response = await api.get<SupplierResponseDto>(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (
    supplier: SupplierRequestDto,
  ): Promise<SupplierResponseDto> => {
    const response = await api.post<SupplierResponseDto>(API_URL, supplier);

    return response.data;
  },

  update: async (
    id: string,
    supplier: Partial<SupplierRequestDto>,
  ): Promise<SupplierResponseDto> => {
    const response = await api.patch<SupplierResponseDto>(
      `${API_URL}/${id}`,
      supplier,
    );
    return response.data;
  },

  actived: async (
    id: string,
    status: SupplierStatus,
  ): Promise<SupplierResponseDto> => {
    const response = await api.patch<SupplierResponseDto>(
      `${API_URL}/${id}/status`,
      { status },
    );
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  },
};
