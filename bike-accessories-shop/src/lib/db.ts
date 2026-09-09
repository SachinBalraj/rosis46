import "server-only";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getCategoryVisual } from "@/lib/category-visuals";
import type { Product } from "@/lib/data";
import type { DbCategory } from "@/types/category";
import type {
  DbProduct,
  AdminProductRow,
  ProductCategoryRef,
} from "@/types/product";
import type { DbUser, Role } from "@/types/user";
import type {
  DbOrder,
  NewOrderItem,
  OrderItemRef,
  OrderStatus,
} from "@/types/order";
import type { DbPaymentEvent, PaymentEventStatus } from "@/types/payment";
import type {
  DbContactMessage,
  ContactMessageStatus,
} from "@/types/contact-message";
import { COLLECTIONS } from "@/lib/collections";

function toObjectId(value: string): ObjectId | null {
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}

function now(): Date {
  return new Date();
}

function mapCategory(doc: Record<string, unknown>): DbCategory {
  return {
    id: doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id),
    name: doc.name as string,
    slug: doc.slug as string,
    image: (doc.image as string | null) ?? null,
    createdAt: (doc.createdAt as Date) ?? now(),
    updatedAt: (doc.updatedAt as Date) ?? now(),
  };
}

function mapProduct(
  doc: Record<string, unknown>,
  category?: { id: string; name: string; slug: string }
): DbProduct {
  return {
    id: doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id),
    name: doc.name as string,
    slug: doc.slug as string,
    description: doc.description as string,
    priceInPaise: doc.priceInPaise as number,
    salePriceInPaise: (doc.salePriceInPaise as number | null) ?? null,
    stock: doc.stock as number,
    imageUrl: (doc.imageUrl as string | null) ?? null,
    categoryId:
      doc.categoryId instanceof ObjectId
        ? doc.categoryId.toHexString()
        : String(doc.categoryId),
    featured: Boolean(doc.featured),
    active: Boolean(doc.active),
    createdAt: (doc.createdAt as Date) ?? now(),
    updatedAt: (doc.updatedAt as Date) ?? now(),
    category,
  };
}

function mapUser(doc: Record<string, unknown>): DbUser {
  return {
    id: doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id),
    name: doc.name as string,
    email: doc.email as string,
    phone: (doc.phone as string | null) ?? null,
    passwordHash: doc.passwordHash as string,
    role: (doc.role as Role) ?? "CUSTOMER",
    createdAt: (doc.createdAt as Date) ?? now(),
    updatedAt: (doc.updatedAt as Date) ?? now(),
  };
}

function mapOrder(doc: Record<string, unknown>): DbOrder {
  return {
    id: doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id),
    userId:
      doc.userId instanceof ObjectId
        ? doc.userId.toHexString()
        : ((doc.userId as string | null) ?? null),
    customerName: doc.customerName as string,
    customerEmail: doc.customerEmail as string,
    customerPhone: doc.customerPhone as string,
    customerAddress: doc.customerAddress as string,
    subtotalInPaise: doc.subtotalInPaise as number,
    shippingInPaise: doc.shippingInPaise as number,
    totalInPaise: doc.totalInPaise as number,
    status: doc.status as DbOrder["status"],
    paymentStatus: doc.paymentStatus as DbOrder["paymentStatus"],
    razorpayOrderId: (doc.razorpayOrderId as string | null) ?? null,
    razorpayPaymentId: (doc.razorpayPaymentId as string | null) ?? null,
    createdAt: (doc.createdAt as Date) ?? now(),
    updatedAt: (doc.updatedAt as Date) ?? now(),
  };
}

function mapOrderItem(doc: Record<string, unknown>): OrderItemRef {
  return {
    id: doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id),
    productId:
      doc.productId instanceof ObjectId
        ? doc.productId.toHexString()
        : String(doc.productId),
    quantity: doc.quantity as number,
    unitPriceInPaise: doc.unitPriceInPaise as number,
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getCategoryBySlug(
  slug: string
): Promise<Record<string, unknown> | null> {
  const db = await getDb();
  return db.collection(COLLECTIONS.categories).findOne({ slug });
}

async function attachCategoryEmbed<T extends { categoryId: string }>(
  product: T
): Promise<T & { category?: { id: string; name: string; slug: string } }> {
  const categoryId = toObjectId(product.categoryId);
  if (!categoryId) return { ...product };
  const db = await getDb();
  const category = await db
    .collection(COLLECTIONS.categories)
    .findOne({ _id: categoryId }, { projection: { name: 1, slug: 1 } });
  if (!category) return { ...product };
  return {
    ...product,
    category: {
      id: category._id instanceof ObjectId ? category._id.toHexString() : "",
      name: category.name as string,
      slug: category.slug as string,
    },
  };
}

export async function getDb() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB_NAME;
  if (!dbName) {
    throw new Error("MONGODB_DB_NAME is not configured");
  }
  return client.db(dbName);
}

type ProductWithCategory = DbProduct & { category: ProductCategoryRef };

async function attachRequiredCategory(
  doc: Record<string, unknown>
): Promise<ProductWithCategory | null> {
  const db = await getDb();
  const product = mapProduct(doc);
  const category = await db.collection(COLLECTIONS.categories).findOne({
    _id: doc.categoryId as ObjectId,
  });
  if (!category) return null;
  const cat = mapCategory(category);
  product.category = { id: cat.id, name: cat.name, slug: cat.slug };
  return product as ProductWithCategory;
}

export function isValidObjectId(value: string): boolean {
  return ObjectId.isValid(value);
}

export type ProductListFilters = {
  category?: string;
  featured?: boolean;
  query?: string;
  limit?: number;
};

export function toCatalogProduct(
  product: DbProduct
): Product {
  const categorySlug = product.category?.slug ?? "store";
  const categoryName = product.category?.name ?? "Store";
  const visual = getCategoryVisual(categorySlug);
  const hasSale =
    product.salePriceInPaise !== null &&
    product.salePriceInPaise < product.priceInPaise;
  const price = Math.round(
    (hasSale ? product.salePriceInPaise! : product.priceInPaise) / 100
  );
  const mrp = hasSale ? Math.round(product.priceInPaise / 100) : price;
  return {
    id: product.slug,
    name: product.name,
    category: categorySlug as Product["category"],
    categoryLabel: categoryName,
    price,
    mrp,
    rating: null,
    reviewCount: null,
    description: product.description,
    accent: visual.accent,
    icon: visual.icon,
    featured: product.featured,
    badge: hasSale ? "Sale" : undefined,
  };
}

export async function getCategoriesWithCounts() {
  const db = await getDb();

  const pipeline = [
    { $match: { active: true } },
    { $group: { _id: "$categoryId", count: { $sum: 1 } } },
  ];
  const counts = await db
    .collection(COLLECTIONS.products)
    .aggregate<{ _id: unknown; count: number }>(pipeline)
    .toArray();
  const countById = new Map<string, number>();
  for (const row of counts) {
    const key =
      row._id instanceof ObjectId ? row._id.toHexString() : String(row._id);
    countById.set(key, row.count);
  }

  const categories = await db
    .collection(COLLECTIONS.categories)
    .find({})
    .sort({ name: 1 })
    .toArray();

  return categories.map((category) => {
    const mapped = mapCategory(category);
    return {
      ...mapped,
      _count: { products: countById.get(mapped.id) ?? 0 },
    };
  });
}

export async function getActiveProducts({
  category,
  featured,
  query,
  limit,
}: ProductListFilters = {}) {
  const db = await getDb();

  const filter: Record<string, unknown> = { active: true };

  if (category) {
    const categoryDoc = await getCategoryBySlug(category);
    if (!categoryDoc) {
      return [] as DbProduct[];
    }
    filter.categoryId = categoryDoc._id;
  }

  if (featured !== undefined) {
    filter.featured = featured;
  }

  if (query && query.trim()) {
    const escaped = escapeRegex(query.trim());
    filter.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { description: { $regex: escaped, $options: "i" } },
    ];
  }

  const cursor = db
    .collection(COLLECTIONS.products)
    .find(filter)
    .sort({ featured: -1, createdAt: -1 });
  if (limit) {
    cursor.limit(limit);
  }
  const docs = await cursor.toArray();

  const categoryIds = docs
    .map((doc) => toObjectId(String(doc.categoryId)))
    .filter((id): id is ObjectId => id !== null);
  const categories =
    categoryIds.length > 0
      ? await db
          .collection(COLLECTIONS.categories)
          .find({ _id: { $in: categoryIds } })
          .toArray()
      : [];
  const categoryById = new Map(
    categories.map((category) => [String(category._id), category])
  );

  return docs.map((doc) => {
    const category = categoryById.get(String(doc.categoryId));
    const mapped = mapProduct(doc);
    if (category) {
      const cat = mapCategory(category);
      mapped.category = { id: cat.id, name: cat.name, slug: cat.slug };
    }
    return mapped;
  });
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTIONS.products).findOne({
    slug,
    active: true,
  });
  if (!doc) return null;
  return attachRequiredCategory(doc);
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4
): Promise<ProductWithCategory[]> {
  const db = await getDb();
  const categoryObjectId = toObjectId(categoryId);
  const excludeObjectId = toObjectId(excludeProductId);
  if (!categoryObjectId) return [] as ProductWithCategory[];

  const docs = await db
    .collection(COLLECTIONS.products)
    .find({
      active: true,
      categoryId: categoryObjectId,
      ...(excludeObjectId ? { _id: { $ne: excludeObjectId } } : {}),
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  const withCategory = await Promise.all(
    docs.map((doc) => attachRequiredCategory(doc))
  );
  return withCategory.filter(
    (product): product is ProductWithCategory => product !== null
  );
}

/* ---------- Users / authentication ---------- */

export async function findUserByEmail(email: string) {
  const db = await getDb();
  const doc = await db.collection(COLLECTIONS.users).findOne({ email });
  return doc ? mapUser(doc) : null;
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  role?: Role;
}) {
  const db = await getDb();
  const timestamp = now();
  const result = await db.collection(COLLECTIONS.users).insertOne({
    name: data.name,
    email: data.email,
    phone: data.phone,
    passwordHash: data.passwordHash,
    role: data.role ?? "CUSTOMER",
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return {
    id: result.insertedId.toHexString(),
  };
}

export async function setUserRoleByEmail(email: string, role: Role) {
  const db = await getDb();
  return db
    .collection(COLLECTIONS.users)
    .updateOne({ email }, { $set: { role, updatedAt: now() } });
}

/* ---------- Products (admin) ---------- */

export async function listAdminProducts() {
  const db = await getDb();

  const itemCounts = await db
    .collection(COLLECTIONS.orderItems)
    .aggregate<{ _id: unknown; n: number }>([
      { $group: { _id: "$productId", n: { $sum: 1 } } },
    ])
    .toArray();
  const countByProductId = new Map<string, number>();
  for (const row of itemCounts) {
    const key =
      row._id instanceof ObjectId ? row._id.toHexString() : String(row._id);
    countByProductId.set(key, row.n);
  }

  const docs = await db
    .collection(COLLECTIONS.products)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const rows: AdminProductRow[] = await Promise.all(
    docs.map(async (doc) => {
      const product = await attachCategoryEmbed(mapProduct(doc));
      return {
        ...product,
        _count: { orderItems: countByProductId.get(product.id) ?? 0 },
      };
    })
  );
  return rows;
}

export async function getProductById(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTIONS.products).findOne({ _id: objectId });
  return doc ? mapProduct(doc) : null;
}

export async function createProduct(data: {
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
}) {
  const db = await getDb();
  const timestamp = now();
  await db.collection(COLLECTIONS.products).insertOne({
    name: data.name,
    slug: data.slug,
    description: data.description,
    priceInPaise: data.priceInPaise,
    salePriceInPaise: data.salePriceInPaise,
    stock: data.stock,
    imageUrl: data.imageUrl,
    categoryId: toObjectId(data.categoryId),
    featured: data.featured,
    active: data.active,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const created = await db
    .collection(COLLECTIONS.products)
    .findOne({ slug: data.slug });
  const product = created ? mapProduct(created) : null;
  if (!product) return null;
  return attachCategoryEmbed(product);
}

export async function getCategoryNameById(categoryId: string) {
  const objectId = toObjectId(categoryId);
  if (!objectId) return null;
  const db = await getDb();
  return db
    .collection(COLLECTIONS.categories)
    .findOne({ _id: objectId }, { projection: { name: 1, slug: 1 } });
}

export async function updateProductById(
  id: string,
  data: {
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
  }
) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await getDb();
  await db.collection(COLLECTIONS.products).updateOne(
    { _id: objectId },
    {
      $set: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        priceInPaise: data.priceInPaise,
        salePriceInPaise: data.salePriceInPaise,
        stock: data.stock,
        imageUrl: data.imageUrl,
        categoryId: toObjectId(data.categoryId),
        featured: data.featured,
        active: data.active,
        updatedAt: now(),
      },
    }
  );
  const doc = await db.collection(COLLECTIONS.products).findOne({ _id: objectId });
  if (!doc) return null;
  return attachCategoryEmbed(mapProduct(doc));
}

export async function deleteProductById(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return false;
  const db = await getDb();
  const result = await db.collection(COLLECTIONS.products).deleteOne({ _id: objectId });
  return result.deletedCount === 1;
}

export async function toggleProductActive(
  id: string,
  active: boolean
): Promise<{ id: string; active: boolean } | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await getDb();
  await db.collection(COLLECTIONS.products).updateOne(
    { _id: objectId },
    { $set: { active, updatedAt: now() } }
  );
  return { id, active };
}

export async function countOrderItemsForProduct(productId: string) {
  const objectId = toObjectId(productId);
  if (!objectId) return 0;
  const db = await getDb();
  return db
    .collection(COLLECTIONS.orderItems)
    .countDocuments({ productId: objectId });
}

/* ---------- Categories (admin) ---------- */

export async function getCategoryNames() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTIONS.categories)
    .find({}, { projection: { name: 1 } })
    .sort({ name: 1 })
    .toArray();
  return docs.map((doc) => ({
    id:
      doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id),
    name: doc.name as string,
  }));
}

export async function getCategoryById(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTIONS.categories).findOne({ _id: objectId });
  return doc ? mapCategory(doc) : null;
}

export async function listAdminCategories() {
  const db = await getDb();

  const productCounts = await db
    .collection(COLLECTIONS.products)
    .aggregate<{ _id: unknown; n: number }>([
      { $group: { _id: "$categoryId", n: { $sum: 1 } } },
    ])
    .toArray();
  const countByCategoryId = new Map<string, number>();
  for (const row of productCounts) {
    const key =
      row._id instanceof ObjectId ? row._id.toHexString() : String(row._id);
    countByCategoryId.set(key, row.n);
  }

  const categories = await db
    .collection(COLLECTIONS.categories)
    .find({})
    .sort({ name: 1 })
    .toArray();

  return categories.map((category) => {
    const mapped = mapCategory(category);
    return {
      ...mapped,
      _count: { products: countByCategoryId.get(mapped.id) ?? 0 },
    };
  });
}

export async function categoryExists(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return false;
  const db = await getDb();
  return (
    (await db.collection(COLLECTIONS.categories).countDocuments({ _id: objectId })) > 0
  );
}

export async function createCategory(data: {
  name: string;
  slug: string;
  image: string | null;
}) {
  const db = await getDb();
  const timestamp = now();
  const result = await db.collection(COLLECTIONS.categories).insertOne({
    name: data.name,
    slug: data.slug,
    image: data.image,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  const category = await getCategoryById(result.insertedId.toHexString());
  if (!category) return null;
  return { ...category, _count: { products: 0 } };
}

export async function updateCategoryById(
  id: string,
  data: { name: string; slug: string; image: string | null }
) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await getDb();
  await db.collection(COLLECTIONS.categories).updateOne(
    { _id: objectId },
    { $set: { name: data.name, slug: data.slug, image: data.image, updatedAt: now() } }
  );
  return getCategoryById(id);
}

export async function deleteCategoryById(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return false;
  const db = await getDb();
  const result = await db
    .collection(COLLECTIONS.categories)
    .deleteOne({ _id: objectId });
  return result.deletedCount === 1;
}

export async function countProductsInCategory(categoryId: string) {
  const objectId = toObjectId(categoryId);
  if (!objectId) return 0;
  const db = await getDb();
  return db
    .collection(COLLECTIONS.products)
    .countDocuments({ categoryId: objectId });
}

/* ---------- Orders ---------- */

export async function getOrderById(id: string): Promise<DbOrder | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTIONS.orders).findOne({ _id: objectId });
  return doc ? mapOrder(doc) : null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<{ id: string; status: OrderStatus } | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await getDb();
  const result = await db
    .collection(COLLECTIONS.orders)
    .updateOne({ _id: objectId }, { $set: { status, updatedAt: now() } });
  if (result.matchedCount === 0) return null;
  return { id, status };
}

export async function findOrderByRazorpayOrderId(razorpayOrderId: string) {
  const db = await getDb();
  const doc = await db
    .collection(COLLECTIONS.orders)
    .findOne({ razorpayOrderId });
  return doc ? mapOrder(doc) : null;
}

export async function markOrderPaid(
  orderId: string,
  razorpayPaymentId: string
) {
  const objectId = toObjectId(orderId);
  if (!objectId) return 0;
  const db = await getDb();
  const result = await db.collection(COLLECTIONS.orders).updateOne(
    { _id: objectId, paymentStatus: "PENDING" },
    {
      $set: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        razorpayPaymentId,
        updatedAt: now(),
      },
    }
  );
  return result.matchedCount;
}

export type OrderItemWithProduct = OrderItemRef & {
  product: { id: string; name: string; imageUrl: string | null };
};

export type OrderWithProductItems = Omit<DbOrder, "items"> & {
  items: OrderItemWithProduct[];
};

export async function getOrderWithItems(
  orderId: string
): Promise<OrderWithProductItems | null> {
  const objectId = toObjectId(orderId);
  if (!objectId) return null;
  const db = await getDb();

  const doc = await db.collection(COLLECTIONS.orders).findOne({ _id: objectId });
  if (!doc) return null;
  const order = mapOrder(doc);

  const items = await db
    .collection(COLLECTIONS.orderItems)
    .find({ orderId: objectId })
    .sort({ _id: 1 })
    .toArray();

  const productIds = items
    .map((item) => (item.productId instanceof ObjectId ? item.productId : null))
    .filter((id): id is ObjectId => id !== null);
  const products =
    productIds.length > 0
      ? await db
          .collection(COLLECTIONS.products)
          .find({ _id: { $in: productIds } }, { projection: { name: 1, imageUrl: 1 } })
          .toArray()
      : [];
  const productById = new Map(products.map((p) => [String(p._id), p]));

  order.items = items.map((item) => {
    const mapped = mapOrderItem(item) as OrderItemWithProduct;
    const product = productById.get(String(item.productId));
    mapped.product =
      product && product._id instanceof ObjectId
        ? {
            id: product._id.toHexString(),
            name: (product.name as string) ?? "",
            imageUrl: (product.imageUrl as string | null) ?? null,
          }
        : {
            id: mapped.productId,
            name: "",
            imageUrl: null,
          };
    return mapped;
  });

  return order as OrderWithProductItems;
}

export async function listOrdersForUser(userId: string) {
  const objectId = toObjectId(userId);
  if (!objectId) return [] as (DbOrder & { items: OrderItemRef[] })[];
  const db = await getDb();

  const docs = await db
    .collection(COLLECTIONS.orders)
    .find({ userId: objectId })
    .sort({ createdAt: -1 })
    .toArray();

  const orderIds = docs.map((doc) => doc._id as ObjectId);
  const itemCounts =
    orderIds.length > 0
      ? await db
          .collection(COLLECTIONS.orderItems)
          .aggregate<{ _id: ObjectId; n: number }>([
            { $match: { orderId: { $in: orderIds } } },
            { $group: { _id: "$orderId", n: { $sum: "$quantity" } } },
          ])
          .toArray()
      : [];
  const countByOrderId = new Map(itemCounts.map((row) => [String(row._id), row.n]));

  return docs.map((doc) => {
    const order = mapOrder(doc) as DbOrder & { items: OrderItemRef[] };
    order.items = [{ quantity: countByOrderId.get(order.id) ?? 0 } as OrderItemRef];
    return order;
  });
}

export async function findRecentDuplicateOrder(
  customerEmail: string,
  since: Date
): Promise<(DbOrder & { items: OrderItemRef[] }) | null> {
  const db = await getDb();
  const doc = await db
    .collection(COLLECTIONS.orders)
    .findOne(
      {
        customerEmail,
        status: "PENDING",
        paymentStatus: "PENDING",
        createdAt: { $gte: since },
      },
      { sort: { createdAt: -1 } }
    );
  if (!doc) return null;
  const order = mapOrder(doc) as DbOrder & { items: OrderItemRef[] };

  const items = await db
    .collection(COLLECTIONS.orderItems)
    .find({
      orderId: doc._id instanceof ObjectId ? doc._id : new ObjectId(order.id),
    })
    .toArray();
  order.items = items.map((item) => ({
    productId: mapOrderItem(item).productId,
    quantity: item.quantity as number,
  })) as OrderItemRef[];

  return order;
}

export async function createOrderAndItems(data: {
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  subtotalInPaise: number;
  shippingInPaise: number;
  totalInPaise: number;
  items: NewOrderItem[];
}) {
  const db = await getDb();
  const timestamp = now();
  const orderResult = await db.collection(COLLECTIONS.orders).insertOne({
    userId: data.userId ? toObjectId(data.userId) : null,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    customerAddress: data.customerAddress,
    subtotalInPaise: data.subtotalInPaise,
    shippingInPaise: data.shippingInPaise,
    totalInPaise: data.totalInPaise,
    status: "PENDING",
    paymentStatus: "PENDING",
    razorpayOrderId: null,
    razorpayPaymentId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const orderId = orderResult.insertedId;
  if (data.items.length > 0) {
    await db.collection(COLLECTIONS.orderItems).insertMany(
      data.items.map((item) => ({
        orderId,
        productId: toObjectId(item.productId),
        quantity: item.quantity,
        unitPriceInPaise: item.unitPriceInPaise,
      }))
    );
  }

  return orderId.toHexString();
}

export async function deleteOrderWithItems(orderId: string) {
  const objectId = toObjectId(orderId);
  if (!objectId) return;
  const db = await getDb();
  await db.collection(COLLECTIONS.orderItems).deleteMany({ orderId: objectId });
  await db.collection(COLLECTIONS.orders).deleteOne({ _id: objectId });
}

export async function setOrderRazorpayOrderId(
  orderId: string,
  razorpayOrderId: string
) {
  const objectId = toObjectId(orderId);
  if (!objectId) return;
  const db = await getDb();
  await db
    .collection(COLLECTIONS.orders)
    .updateOne({ _id: objectId }, { $set: { razorpayOrderId, updatedAt: now() } });
}

/* ---------- Stock (inventory) ---------- */

export async function listProductsByIds(ids: string[]) {
  const objectIds = ids
    .map((id) => toObjectId(id))
    .filter((id): id is ObjectId => id !== null);
  if (objectIds.length === 0) return [] as DbProduct[];
  const db = await getDb();
  const docs = await db
    .collection(COLLECTIONS.products)
    .find({ _id: { $in: objectIds } })
    .toArray();
  return docs.map((doc) => mapProduct(doc));
}

export async function reserveStock(lines: NewOrderItem[]) {
  const db = await getDb();
  const reserved: { productId: string; quantity: number }[] = [];

  for (const line of lines) {
    const objectId = toObjectId(line.productId);
    if (!objectId) return { ok: false as const };
    const result = await db.collection(COLLECTIONS.products).updateOne(
      { _id: objectId, active: true, stock: { $gte: line.quantity } },
      { $inc: { stock: -line.quantity } }
    );
    if (result.matchedCount !== 1) {
      await restoreStock(reserved);
      return { ok: false as const };
    }
    reserved.push({ productId: line.productId, quantity: line.quantity });
  }

  return { ok: true as const, lines: reserved };
}

export async function restoreStock(
  lines: { productId: string; quantity: number }[]
) {
  const db = await getDb();
  for (const line of lines) {
    const objectId = toObjectId(line.productId);
    if (!objectId) continue;
    await db
      .collection(COLLECTIONS.products)
      .updateOne({ _id: objectId }, { $inc: { stock: line.quantity } });
  }
}

/* ---------- Payment events (webhook idempotency) ---------- */

export async function findPaymentEvent(providerEventId: string) {
  const db = await getDb();
  const doc = await db
    .collection(COLLECTIONS.paymentEvents)
    .findOne({ providerEventId });
  return doc ? mapPaymentEvent(doc) : null;
}

export async function insertPaymentEvent(data: {
  providerEventId: string;
  orderId: string | null;
  payload: unknown;
}) {
  const db = await getDb();
  try {
    await db.collection(COLLECTIONS.paymentEvents).insertOne({
      providerEventId: data.providerEventId,
      provider: "razorpay",
      orderId: data.orderId ? toObjectId(data.orderId) : null,
      status: "RECEIVED",
      payload: data.payload,
      createdAt: now(),
    });
    return "inserted" as const;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return "duplicate" as const;
    }
    throw error;
  }
}

export async function setPaymentEventStatus(
  providerEventId: string,
  status: PaymentEventStatus
) {
  const db = await getDb();
  return db.collection(COLLECTIONS.paymentEvents).updateOne(
    { providerEventId },
    { $set: { status } }
  );
}

function mapPaymentEvent(doc: Record<string, unknown>): DbPaymentEvent {
  return {
    id: doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id),
    providerEventId: doc.providerEventId as string,
    provider: (doc.provider as string) ?? "razorpay",
    orderId:
      doc.orderId instanceof ObjectId
        ? doc.orderId.toHexString()
        : ((doc.orderId as string | null) ?? null),
    status: (doc.status as PaymentEventStatus) ?? "RECEIVED",
    payload: (doc.payload as unknown) ?? null,
    createdAt: (doc.createdAt as Date) ?? now(),
  };
}

/* ---------- Contact messages ---------- */

export async function listContactMessages() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTIONS.contactMessages)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((doc) => mapContactMessage(doc));
}

export async function getContactMessageById(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await getDb();
  const doc = await db
    .collection(COLLECTIONS.contactMessages)
    .findOne({ _id: objectId });
  return doc ? mapContactMessage(doc) : null;
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  contactNumber: string | null;
  message: string;
}) {
  const db = await getDb();
  const timestamp = now();
  await db.collection(COLLECTIONS.contactMessages).insertOne({
    name: data.name,
    email: data.email,
    contactNumber: data.contactNumber,
    message: data.message,
    status: "NEW",
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export async function setContactMessageStatus(
  id: string,
  status: ContactMessageStatus
): Promise<{ id: string; status: ContactMessageStatus } | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await getDb();
  const result = await db
    .collection(COLLECTIONS.contactMessages)
    .updateOne({ _id: objectId }, { $set: { status, updatedAt: now() } });
  if (result.matchedCount === 0) return null;
  return { id, status };
}

export async function deleteContactMessage(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return false;
  const db = await getDb();
  const result = await db
    .collection(COLLECTIONS.contactMessages)
    .deleteOne({ _id: objectId });
  return result.deletedCount === 1;
}

export async function countNewContactMessages() {
  const db = await getDb();
  return db.collection(COLLECTIONS.contactMessages).countDocuments({
    status: "NEW",
  });
}

function mapContactMessage(doc: Record<string, unknown>): DbContactMessage {
  return {
    id: doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id),
    name: doc.name as string,
    email: doc.email as string,
    contactNumber: (doc.contactNumber as string | null) ?? null,
    message: doc.message as string,
    status: (doc.status as ContactMessageStatus) ?? "NEW",
    createdAt: (doc.createdAt as Date) ?? now(),
    updatedAt: (doc.updatedAt as Date) ?? now(),
  };
}

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as { code: unknown }).code === 11000
  );
}

export { toObjectId };