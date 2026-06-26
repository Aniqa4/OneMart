interface ProductSize {
  label: string;
  inStock: boolean;
}

interface ProductVariant {
  label: string;
  image: string;
  hasSizes: boolean;
  sizes: ProductSize[];
  inStock: boolean;
}

export interface ProductProps {
  _id: string;

  productName: string;
  productImage: string[];

  price: number;
  discountedPrice: number;
  finalPrice: number;

  inStock: boolean;

  categoryName: string;
  categoryID: string;

  subCategoryName: string;
  subCategoryID: string;

  subSubCategoryName: string;
  subSubCategoryID: string;

  
  description: string;

  featured: boolean;

  hasVariants: boolean;
  variants: ProductVariant[];

  createdAt: string;
}
