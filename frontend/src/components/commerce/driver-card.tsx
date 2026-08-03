import { Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";

export interface Driver {
  id: string;
  name: string;
  vehicle: string;
  available: boolean;
}

export function DriverCard({ driver }: { driver: Driver }) {
  const initials = driver.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <Card className="flex items-center gap-3 p-3">
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">{driver.name}</p>
        <p className="text-xs text-text-muted">{driver.vehicle}</p>
      </div>
      <Badge variant={driver.available ? "success" : "neutral"}>{driver.available ? "Available" : "On delivery"}</Badge>
      <IconButton aria-label={`Call ${driver.name}`} size="sm">
        <Phone className="h-3.5 w-3.5" />
      </IconButton>
    </Card>
  );
}
