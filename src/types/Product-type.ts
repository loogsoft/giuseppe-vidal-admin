import type { ProductStatusEnum } from "../dtos/enums/product-status.enum";

export type CategoryKey =
  | "all"
  | "shirt"
  | "tshirt"
  | "polo"
  | "shorts"
  | "jacket"
  | "pants"
  | "dress"
  | "sweater"
  | "hoodie"
  | "underwear"
  | "footwear"
  | "belt"
  | "wallet"
  | "sunglasses";

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryLabel: string;
  categoryKey: Exclude<CategoryKey, "all">;
  price: number;
  imageUrl: string;
  inStock: ProductStatusEnum;
  available: boolean;
}
