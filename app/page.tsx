import Link from "next/link";
import { getProducts } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default function Home() {
  const products = getProducts();
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to My Store</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover premium electronics at unbeatable prices. From headphones
            to monitors, we have everything you need to upgrade your setup.
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Free Shipping
            </h3>
            <p className="text-sm text-gray-600">
              On all orders over $50
            </p>
          </div>
          <div>
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Secure Payments
            </h3>
            <p className="text-sm text-gray-600">
              100% protected transactions
            </p>
          </div>
          <div>
            <div className="text-3xl mb-3">↩️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Easy Returns
            </h3>
            <p className="text-sm text-gray-600">
              30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Upgrade Your Setup?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Browse our full collection of premium electronics and find the
            perfect gear for you.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </main>
  );
}
