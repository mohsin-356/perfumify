"use client";

import React, { useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ManagedUIContext } from "@contexts/ui.context";
import AdminLayout from "@/components/admin/AdminLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef<any>();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          cacheTime: 1000 * 60 * 10,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          retry: 1,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <ManagedUIContext>
        <AdminLayout>{children}</AdminLayout>
      </ManagedUIContext>
    </QueryClientProvider>
  );
}
