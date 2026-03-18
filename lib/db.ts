import fs from "fs";
import path from "path";
import type { Product } from "./products";

const DB_PATH = path.join(process.cwd(), "data", "store.json");

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  stripeSessionId: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    address: string;
    apartment: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "preorder" | "refund";
  createdAt: string;
}

interface StoreData {
  products: Product[];
  orders: Order[];
}

function readDb(): StoreData {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(data: StoreData): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Products
export function getProducts(): Product[] {
  return readDb().products;
}

export function getProduct(id: string): Product | undefined {
  return readDb().products.find((p) => p.id === id);
}

export function addProduct(product: Omit<Product, "id">): Product {
  const db = readDb();
  const id = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const newProduct: Product = { id, ...product };
  db.products.push(newProduct);
  writeDb(db);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Omit<Product, "id">>): Product | null {
  const db = readDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.products[index] = { ...db.products[index], ...updates };
  writeDb(db);
  return db.products[index];
}

export function deleteProduct(id: string): boolean {
  const db = readDb();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === before) return false;
  writeDb(db);
  return true;
}

// Orders
export function getOrders(): Order[] {
  return readDb().orders;
}

export function getOrder(id: string): Order | undefined {
  return readDb().orders.find((o) => o.id === id);
}

export function addOrder(order: Omit<Order, "id" | "status" | "createdAt">): Order {
  const db = readDb();
  const newOrder: Order = {
    ...order,
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.orders.push(newOrder);
  writeDb(db);
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order["status"]): Order | null {
  const db = readDb();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  db.orders[index].status = status;
  writeDb(db);
  return db.orders[index];
}
