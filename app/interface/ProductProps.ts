interface ProductSize {
  label: string;
  quantity: number;
}

interface ProductVariant {
  label: string;
  image: string;
  hasSizes: boolean;
  sizes: ProductSize[];
  quantity: number;
}

export interface ProductProps {
  _id: string;

  productName: string;
  productImage: string[];

  price: number;
  discountedPrice: number | null;
  finalPrice: number;

  categoryName: string;
  categoryID: string;

  subCategoryName: string | null;
  subCategoryID: string | null;

  subSubCategoryName: string | null;
  subSubCategoryID: string | null;

  availableQuantity: number;
  soldQuantity: number;

  description: string;

  featured: boolean;

  hasVariants: boolean;
  variants: ProductVariant[];

  createdAt: string;
}
