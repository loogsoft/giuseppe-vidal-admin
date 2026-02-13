const SUPPLIER_STATUS = ["active", "inactive"] as const;

export type SupplierStatus = (typeof SUPPLIER_STATUS)[number];

export interface SupplierRequestDto {
  name: string;
  category?: string;
  email?: string;
  phone?: string;
  location?: string;
  status?: SupplierStatus;
  avatarColor?: string;
  openOrders?: number;
}