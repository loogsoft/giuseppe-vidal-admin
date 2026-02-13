import type { DiscountStockStatusEnum } from "../dtos/enums/discount-stock-status.enum";

type DiscountStockItem = {
  name: string;
  quantity: number;
};

export interface DiscountStock {
  id: string;
  number: string;
  customerName: string;
  minutes: number;
  total: number;
  status: DiscountStockStatusEnum;
  items?: DiscountStockItem[];
  courierName?: string;
  urgent?: boolean;
  cookingLabel?: string;
}
