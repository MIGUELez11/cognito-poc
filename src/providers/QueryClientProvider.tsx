"use client";

import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(new QueryClient());

  return (
    <ReactQueryClientProvider client={queryClient}>
      <ReactQueryDevtools buttonPosition="bottom-left" position="left" />
      {children}
    </ReactQueryClientProvider>
  );
}
