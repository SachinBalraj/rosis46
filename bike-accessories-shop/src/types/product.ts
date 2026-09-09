export type ProductCategoryRef = {
  id: string;
  name: string;
  slug: string;
};

export type DbProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceInPaise: number;
  salePriceInPaise: number | null;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: ProductCategoryRef;
};

export type AdminProductRow = DbProduct & {
  _count: { orderItems: number };
};