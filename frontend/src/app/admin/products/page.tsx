"use client";
import { useState } from "react";
import { Plus, Search, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/ui/icon-button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { InventoryBadge } from "@/components/commerce/inventory-badge";
import { PriceDisplay } from "@/components/commerce/price-display";
import { Pagination } from "@/components/ui/pagination";
import type { InventoryStatus } from "@/types";

interface ProductRow {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  status: InventoryStatus;
}

const PRODUCTS: ProductRow[] = [
  { id: "SKU-1042", name: "Amul Toned Milk", category: "Dairy & Eggs", brand: "Amul", price: 32, status: "healthy" },
  { id: "SKU-1043", name: "Fortune Sunflower Oil", category: "Cooking Essentials", brand: "Fortune", price: 189, status: "low" },
  { id: "SKU-1044", name: "Robusta Bananas", category: "Fruits & Vegetables", brand: "Local", price: 49, status: "healthy" },
  { id: "SKU-1045", name: "Lay's Classic Salted", category: "Snacks", brand: "Lay's", price: 20, status: "critical" },
  { id: "SKU-1046", name: "Nescafe Classic Coffee", category: "Beverages", brand: "Nescafe", price: 145, status: "healthy" },
  { id: "SKU-1047", name: "Britannia Brown Bread", category: "Bakery", brand: "Britannia", price: 45, status: "overstock" },
];

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Products</h1>
          <p className="text-sm text-text-secondary">Manage the QuickCore product catalog.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> Add product</Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input placeholder="Search products" className="pl-8" aria-label="Search products" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"><Checkbox aria-label="Select all products" /></TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {PRODUCTS.map((p) => (
            <TableRow key={p.id}>
              <TableCell><Checkbox aria-label={`Select ${p.name}`} /></TableCell>
              <TableCell className="font-mono text-xs text-text-secondary">{p.id}</TableCell>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-text-secondary">{p.category}</TableCell>
              <TableCell className="text-text-secondary">{p.brand}</TableCell>
              <TableCell className="text-right"><PriceDisplay amount={p.price} size="sm" /></TableCell>
              <TableCell><InventoryBadge status={p.status} /></TableCell>
              <TableCell>
                <IconButton aria-label={`Edit ${p.name}`} size="sm">
                  <Pencil className="h-3.5 w-3.5" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination page={page} totalPages={4} onPageChange={setPage} totalItems={94} pageSize={25} />
    </div>
  );
}
