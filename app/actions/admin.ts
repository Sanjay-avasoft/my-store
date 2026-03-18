"use server";

import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  addOrder,
} from "@/lib/db";
import type { Order } from "@/lib/db";

// Products
export async function fetchProducts() {
  return getProducts();
}

export async function fetchProduct(id: string) {
  return getProduct(id) ?? null;
}

export async function createProduct(data: {
  name: string;
  price: number;
  description: string;
  image: string;
}) {
  return addProduct(data);
}

export async function editProduct(
  id: string,
  data: { name?: string; price?: number; description?: string; image?: string }
) {
  return updateProduct(id, data);
}

export async function removeProduct(id: string) {
  return deleteProduct(id);
}

// Orders
export async function fetchOrders() {
  return getOrders();
}

export async function changeOrderStatus(id: string, status: Order["status"]) {
  return updateOrderStatus(id, status);
}

export async function createOrder(order: Omit<Order, "id" | "status" | "createdAt">) {
  return addOrder(order);
}
