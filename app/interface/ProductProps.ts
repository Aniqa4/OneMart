export interface ProductProps {
  id: string;
  _id: string;

  productName: string;
  productImage: string;

  price: number;
  discountedPrice: number;
  finalPrice: number;

  categoryName: string;
  categoryID: string;

  subCategoryName: string | null;
  subCategoryID: string | null;

  subSubCategoryName: string | null;
  subSubCategoryID: string | null;

  availableCopies: number;
  soldCopies: number;

  description: string;

  featured: boolean;

  createdAt: string;
  updatedAt: string;
}
