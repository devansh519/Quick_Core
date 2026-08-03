"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--bg-surface-raised)",
          border: "1px solid var(--border-default)",
          color: "var(--text-primary)",
          borderRadius: "var(--radius-lg)",
        },
      }}
    />
  );
}
