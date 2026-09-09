export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryWithCount = DbCategory & {
  _count: { products: number };
};