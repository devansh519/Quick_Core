import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HISTORY = [
  { id: "48190", address: "House 12, Rose Enclave, Dadri", status: "Delivered", time: "Yesterday, 6:40 PM" },
  { id: "48072", address: "Flat 8B, Lotus Towers, Dadri", status: "Delivered", time: "Jul 28, 4:12 PM" },
  { id: "47998", address: "B-402, Cherry Residency, Dadri", status: "Failed", time: "Jul 24, 2:05 PM" },
];

export default function DeliveryHistoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-text-primary">History</h1>
      <div className="flex flex-col gap-2">
        {HISTORY.map((h) => (
          <Card key={h.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Order #{h.id}</p>
              <p className="text-xs text-text-secondary">{h.address}</p>
              <p className="text-xs text-text-muted">{h.time}</p>
            </div>
            <Badge variant={h.status === "Delivered" ? "success" : "error"}>{h.status}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
