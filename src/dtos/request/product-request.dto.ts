import type { ProductCategoryEnum } from "../enums/product-category.enum";
import type { ProductStatusEnum } from "../enums/product-status.enum";
import type { ProductVariationRequestDto } from "./product-variation-request.dto";
import type { SupplierRequestDto } from "./supplier-request.dto";

export interface ProductRequest {
  name: string;
  description?: string;
  category: ProductCategoryEnum;
  status?: ProductStatusEnum;
  price: number;
  promoPrice?: number;
  isActiveStock: boolean;
  stock?: number;
  variations?: ProductVariationRequestDto[];
  supplier: SupplierRequestDto;
  supplierId: string;
}
