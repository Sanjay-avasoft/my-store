import Link from "next/link";
import { getCheckoutSession } from "@/app/actions/stripe";
import { createOrder } from "@/app/actions/admin";
import { getOrders } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CheckoutReturn({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let session = null;
  if (session_id) {
    try {
      session = await getCheckoutSession(session_id);

      // Save order if not already saved
      const existingOrders = getOrders();
      const alreadySaved = existingOrders.some(
        (o) => o.stripeSessionId === session_id
      );
      if (!alreadySaved && (session.status === "complete" || session.status === "open")) {
        await createOrder({
          stripeSessionId: session_id,
          customerEmail: session.customerEmail || "",
          customerName: `${session.shipping.firstName} ${session.shipping.lastName}`.trim() || "Customer",
          shippingAddress: {
            address: session.shipping.address,
            apartment: "",
            city: session.shipping.city,
            state: session.shipping.state,
            zip: session.shipping.zip,
            country: session.shipping.country,
          },
          items: session.lineItems || [],
          total: session.amountTotal || 0,
        });
      }
    } catch (err) {
      console.error("Checkout return error:", err);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thank you for your order!
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was successful. A confirmation email will be sent to{" "}
          {session?.customerEmail ? (
            <span className="font-medium text-gray-900">
              {session.customerEmail}
            </span>
          ) : (
            "your email"
          )}
          .
        </p>

        {session?.shipping && session.shipping.address && (
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Shipping to
            </h2>
            <p className="text-sm text-gray-600">
              {session.shipping.firstName} {session.shipping.lastName}
            </p>
            <p className="text-sm text-gray-600">{session.shipping.address}</p>
            <p className="text-sm text-gray-600">
              {session.shipping.city}, {session.shipping.state}{" "}
              {session.shipping.zip}, {session.shipping.country}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
