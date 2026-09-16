export type CheckoutDirectItem = {
  id: string;
  slug: string;
  name: string;
  unitPriceInPaise: number;
  quantity: number;
  stock: number | null;
  imageUrl: string | null;
  icon: string;
  accent: string;
  categoryName: string;
  subCategory: string | null;
};