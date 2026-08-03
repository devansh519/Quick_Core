import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";

export interface Address {
  id: string;
  label: string;
  line: string;
  isDefault?: boolean;
}

export function AddressCard({ address, onEdit, onDelete }: { address: Address; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <Card className="flex items-start gap-3 p-4">
      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary">{address.label}</p>
          {address.isDefault && <Badge variant="signal">Default</Badge>}
        </div>
        <p className="text-sm text-text-secondary">{address.line}</p>
      </div>
      <div className="flex gap-1">
        <IconButton aria-label={`Edit ${address.label} address`} size="sm" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton aria-label={`Delete ${address.label} address`} size="sm" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </IconButton>
      </div>
    </Card>
  );
}
