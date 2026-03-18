import { getOrders } from "@/lib/db";

interface CustomerSummary {
  email: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

export default function AdminUsersPage() {
  const orders = getOrders();

  // Aggregate customers from orders
  const customerMap = new Map<string, CustomerSummary>();
  for (const order of orders) {
    const existing = customerMap.get(order.customerEmail);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += order.total;
      if (order.createdAt > existing.lastOrder) {
        existing.lastOrder = order.createdAt;
      }
    } else {
      customerMap.set(order.customerEmail, {
        email: order.customerEmail,
        name: order.customerName,
        totalOrders: 1,
        totalSpent: order.total,
        lastOrder: order.createdAt,
      });
    }
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      {customers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No customers yet. Customer data will appear here after orders are
          placed.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b bg-gray-50">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3">Total Spent</th>
                <th className="px-6 py-3">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.email} className="border-b last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${(customer.totalSpent / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(customer.lastOrder).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
