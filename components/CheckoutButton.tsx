"use client";

import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { createCheckoutSession } from "@/app/actions/stripe";
import { useCart } from "@/store/useCart";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutButton() {
  const [showCheckout, setShowCheckout] = useState(false);
  const items = useCart((s) => s.items);
  const closeCart = useCart((s) => s.closeCart);

  const fetchClientSecret = useCallback(async () => {
    const checkoutItems = items.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const { clientSecret } = await createCheckoutSession(checkoutItems);
    return clientSecret!;
  }, [items]);

  const handleCheckout = () => {
    closeCart();
    setShowCheckout(true);
  };

  if (showCheckout) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <button
            onClick={() => setShowCheckout(false)}
            className="mb-6 text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
          >
            ← Back to cart
          </button>
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
    >
      Checkout
    </button>
  );
}
