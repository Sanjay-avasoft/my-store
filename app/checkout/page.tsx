"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCart } from "@/store/useCart";
import { createCheckoutSession } from "@/app/actions/stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, removeItem, updateQuantity } = useCart();
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const shippingCost = delivery === "express" ? 999 : 0;
  const [shipping, setShipping] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  if (items.length === 0 && step === "shipping") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const fetchClientSecret = async () => {
    const checkoutItems = items.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      checkoutItems.push({
        name: "Express Shipping",
        price: shippingCost,
        quantity: 1,
      });
    }

    const { clientSecret } = await createCheckoutSession(
      checkoutItems,
      shipping,
      window.location.origin
    );
    return clientSecret!;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`flex items-center gap-2 ${
              step === "shipping"
                ? "text-blue-600 font-semibold"
                : "text-gray-400"
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
              1
            </span>
            Shipping
          </div>
          <div className="w-12 h-px bg-gray-300" />
          <div
            className={`flex items-center gap-2 ${
              step === "payment"
                ? "text-blue-600 font-semibold"
                : "text-gray-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full text-sm flex items-center justify-center ${
                step === "payment"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-white"
              }`}
            >
              2
            </span>
            Payment
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form or Payment */}
          <div className="lg:col-span-2">
            {step === "shipping" ? (
              <form
                onSubmit={handleSubmitShipping}
                className="bg-white rounded-lg shadow p-6 space-y-6"
              >
                {/* Contact */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shipping.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shipping.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shipping.email}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shipping.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shipping.address}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, suite, etc.
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={shipping.apartment}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shipping.city}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={shipping.state}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zip"
                          value={shipping.zip}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={shipping.country}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="IN">India</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Delivery Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer ${
                        delivery === "standard"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value="standard"
                        checked={delivery === "standard"}
                        onChange={() => setDelivery("standard")}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Standard Shipping
                        </p>
                        <p className="text-xs text-gray-500">5–7 business days</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          Free
                        </p>
                      </div>
                    </label>
                    <label
                      className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer ${
                        delivery === "express"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value="express"
                        checked={delivery === "express"}
                        onChange={() => setDelivery("express")}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Express Shipping
                        </p>
                        <p className="text-xs text-gray-500">2–3 business days</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          $9.99
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                {/* Shipping summary */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Shipping to
                    </h2>
                    <button
                      onClick={() => setStep("shipping")}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {shipping.firstName} {shipping.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {shipping.address}
                    {shipping.apartment && `, ${shipping.apartment}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {shipping.city}, {shipping.state} {shipping.zip},{" "}
                    {shipping.country}
                  </p>
                  <p className="text-sm text-gray-600">{shipping.email}</p>
                </div>

                {/* Stripe Embedded Checkout */}
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ fetchClientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <ul className="space-y-4 mb-6">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${(item.product.price / 100).toFixed(2)} each
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      ${((item.product.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${(totalPrice() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "Free"
                      : `$${(shippingCost / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>
                    ${((totalPrice() + shippingCost) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
