"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
