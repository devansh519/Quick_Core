import { Milk, Apple, Cookie, Beef, Coffee, SprayCan } from "lucide-react";
import { CategoryCard } from "@/components/commerce/category-card";
import { ProductCard, type Product } from "@/components/commerce/product-card";
import { Card } from "@/components/ui/card";

const CATEGORIES = [
  { name: "Dairy & Eggs", icon: Milk, href: "/categories" },
  { name: "Fruits & Vegetables", icon: Apple, href: "/categories" },
  { name: "Snacks", icon: Cookie, href: "/categories" },
  { name: "Meat & Seafood", icon: Beef, href: "/categories" },
  { name: "Beverages", icon: Coffee, href: "/categories" },
  { name: "Household", icon: SprayCan, href: "/categories" },
];

const FEATURED: Product[] = [
  { id: "p1", name: "Amul Toned Milk", category: "Dairy & Eggs", price: 32, unit: "500 ml pouch" },
  { id: "p2", name: "Fortune Sunflower Oil", category: "Cooking Essentials", price: 189, originalPrice: 219, unit: "1 L bottle" },
  { id: "p3", name: "Robusta Bananas", category: "Fruits & Vegetables", price: 49, unit: "1 dozen" },
  { id: "p4", name: "Lay's Classic Salted", category: "Snacks", price: 20, unit: "52 g pack" },
  { id: "p5", name: "Nescafe Classic Coffee", category: "Beverages", price: 145, originalPrice: 165, unit: "100 g jar" },
  { id: "p6", name: "Britannia Brown Bread", category: "Bakery", price: 45, unit: "400 g pack" },
];

export default function CustomerHomePage() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="flex flex-col gap-1 bg-brand-signal p-6 text-white md:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-white/70">Delivering to Dadri, Uttar Pradesh</p>
        <h1 className="text-2xl font-semibold md:text-3xl">Groceries delivered in 12 minutes</h1>
        <p className="text-sm text-white/80">Fresh produce, dairy, and daily essentials &mdash; right to your door.</p>
      </Card>

      <section>
        <h2 className="mb-3 text-[15px] font-semibold text-text-primary">Shop by category</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.name} {...c} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[15px] font-semibold text-text-primary">Popular right now</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {FEATURED.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
