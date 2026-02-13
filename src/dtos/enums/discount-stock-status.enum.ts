export const DiscountStockStatusEnum = {
  NEW: "NEW",
  PREPARING: "PREPARING",
  ON_ROUTE: "ON_ROUTE",
} as const;

export type DiscountStockStatusEnum =
  typeof DiscountStockStatusEnum[keyof typeof DiscountStockStatusEnum];
