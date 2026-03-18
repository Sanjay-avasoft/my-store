"use client";

import { useEffect, useState } from "react";
import { fetchOrders, changeOrderStatus } from "@/app/actions/admin";
import type { Order } from "@/lib/db";

const STATUS_OPTIONS: Order["status"][] = [
  "pending",
  "preorder",
  "processing",
  "shipped",
  "delivered",
  "refund",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadOrders = async () => {
    const data = await fetchOrders();
    setOrders(data.reverse());
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    status: Order["status"]
  ) => {
    await changeOrderStatus(orderId, status);
    loadOrders();
  };

  if (loading) {
    return <p className="text-gray-500">Loading orders...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No orders yet.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b bg-gray-50">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="border-b cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setExpandedId(
                        expandedId === order.id ? null : order.id
                      )
                    }
                  >
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {order.items.length} item
                      {order.items.length !== 1 && "s"}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      ${(order.total / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as Order["status"]
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border cursor-pointer ${
                          order.status === "delivered"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : order.status === "shipped"
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : order.status === "processing"
                            ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                            : order.status === "preorder"
                            ? "bg-purple-50 border-purple-200 text-purple-700"
                            : order.status === "refund"
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`${order.id}-detail`} className="border-b bg-gray-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                              Order Items
                            </h3>
                            <ul className="space-y-1">
                              {order.items.map((item, i) => (
                                <li
                                  key={i}
                                  className="text-sm text-gray-600 flex justify-between"
                                >
                                  <span>
                                    {item.name} x{item.quantity}
                                  </span>
                                  <span>
                                    $
                                    {(
                                      (item.price * item.quantity) /
                                      100
                                    ).toFixed(2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                              Shipping Address
                            </h3>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.address}
                              {order.shippingAddress.apartment &&
                                `, ${order.shippingAddress.apartment}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state}{" "}
                              {order.shippingAddress.zip}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.country}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
