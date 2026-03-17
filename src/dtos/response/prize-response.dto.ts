export interface PrizeResponseDto {
  name: string;
  description?: string;
  imageUrl?: string;
  quantity: number;
  probability: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
