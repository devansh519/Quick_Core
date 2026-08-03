import { Milk, Apple, Cookie, Beef, Coffee, SprayCan, Baby, PawPrint } from "lucide-react";
import { CategoryCard } from "@/components/commerce/category-card";

const ALL_CATEGORIES = [
  { name: "Dairy & Eggs", icon: Milk },
  { name: "Fruits & Vegetables", icon: Apple },
  { name: "Snacks", icon: Cookie },
  { name: "Meat & Seafood", icon: Beef },
  { name: "Beverages", icon: Coffee },
  { name: "Household", icon: SprayCan },
  { name: "Baby Care", icon: Baby },
  { name: "Pet Supplies", icon: PawPrint },
];

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Categories</h1>
        <p className="text-sm text-text-secondary">Browse everything QuickCore delivers.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {ALL_CATEGORIES.map((c) => (
          <CategoryCard key={c.name} name={c.name} icon={c.icon} href="/categories" />
        ))}
      </div>
    </div>
  );
}
