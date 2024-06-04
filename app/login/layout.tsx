"use client";

import useSession from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session, isFetching } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && !isFetching) {
      router.push("/private");
    }
  }, [session, router, isFetching]);

  return <div>{children}</div>;
}
