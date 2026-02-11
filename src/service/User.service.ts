import type { LoginRequestDto } from "../dtos/request/login-request.dto";
import type { VerifyCoderequestDto } from "../dtos/request/verification-code-request.dto";
import type { LoginResponseDto } from "../dtos/response/login-response.dto";
import api from "./api";

export const UserService = {
  verifyEmail: async (dto: LoginRequestDto) => {
    const response = await api.post(
      "/users/verify-email",
      dto
    );
    return response.data;
  },

  verificationToken: async (dto: VerifyCoderequestDto): Promise<LoginResponseDto> => {
    const response = await api.post<LoginResponseDto>(
      "/users/verify-code",
      dto
    );
    return response.data;
  },
};