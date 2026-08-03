"use client";
import { Plus } from "lucide-react";
import { AddressCard, type Address } from "@/components/commerce/address-card";
import { Button } from "@/components/ui/button";

const ADDRESSES: Address[] = [
  { id: "a1", label: "Home", line: "B-402, Cherry Residency, Dadri, UP 203207", isDefault: true },
  { id: "a2", label: "Work", line: "3rd Floor, Tech Park, Sector 62, Noida, UP" },
];

export default function AddressesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Saved addresses</h1>
          <p className="text-sm text-text-secondary">Manage where your orders get delivered.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> Add address</Button>
      </div>
      <div className="flex flex-col gap-3">
        {ADDRESSES.map((a) => (
          <AddressCard key={a.id} address={a} />
        ))}
      </div>
    </div>
  );
}
