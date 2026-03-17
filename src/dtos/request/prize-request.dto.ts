
export interface PrizeRequestDto {
  name: string;
  description: string;
  imageUrl?: string;
  quantity: number;
  probability: number;
  active?: boolean;
}
