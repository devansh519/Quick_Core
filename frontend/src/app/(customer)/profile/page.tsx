"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function ProfilePage() {
  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Profile</h1>
        <p className="text-sm text-text-secondary">Manage your personal information.</p>
      </div>
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-base">AR</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Ananya Rao</CardTitle>
            <p className="text-sm text-text-muted">ananya@quickcore.app</p>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" defaultValue="Ananya Rao" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" defaultValue="+91 98765 43210" />
          </div>
          <Button className="w-fit" onClick={() => toast.success("Profile updated")}>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
