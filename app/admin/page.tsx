import { getProducts } from "@/lib/db";
import { getOrders } from "@/lib/db";
import Link from "next/link";

export default function AdminDashboard() {
  const products = getProducts();
  const orders = getOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(-5).reverse();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {products.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {orders.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            ${(totalRevenue / 100).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-8 text-gray-500 text-center">
            No orders yet.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    ${(order.total / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "preorder"
                          ? "bg-purple-100 text-purple-700"
                          : order.status === "refund"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
