export type SupplierStatus = "active" | "inactive";

export interface SupplierRequestDto {
  id: string;
  name: string;
  category?: string;
  email?: string;
  phone?: string;
  location?: string;
  status?: SupplierStatus;
  avatarColor?: string;
  openDiscountStock?: number;
}