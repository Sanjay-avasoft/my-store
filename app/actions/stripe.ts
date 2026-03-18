"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

interface CheckoutItem {
  name: string;
  price: number; // in cents
  quantity: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export async function createCheckoutSession(
  items: CheckoutItem[],
  shipping: ShippingInfo,
  origin?: string
) {
  const baseUrl = origin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    customer_email: shipping.email,
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    return_url: `${baseUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      shipping_first_name: shipping.firstName,
      shipping_last_name: shipping.lastName,
      shipping_phone: shipping.phone,
      shipping_address: shipping.address,
      shipping_apartment: shipping.apartment,
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      shipping_zip: shipping.zip,
      shipping_country: shipping.country,
    },
  });

  return { clientSecret: session.client_secret };
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  const lineItems = (session.line_items?.data ?? []).map((item) => ({
    name: item.description ?? "Item",
    price: item.price?.unit_amount ?? 0,
    quantity: item.quantity ?? 1,
  }));

  return {
    status: session.status,
    customerEmail: session.customer_details?.email ?? session.customer_email,
    amountTotal: session.amount_total ?? 0,
    lineItems,
    shipping: {
      firstName: session.metadata?.shipping_first_name ?? "",
      lastName: session.metadata?.shipping_last_name ?? "",
      address: session.metadata?.shipping_address ?? "",
      city: session.metadata?.shipping_city ?? "",
      state: session.metadata?.shipping_state ?? "",
      zip: session.metadata?.shipping_zip ?? "",
      country: session.metadata?.shipping_country ?? "",
    },
  };
}
