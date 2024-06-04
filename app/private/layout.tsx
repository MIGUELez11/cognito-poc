"use client";

import useSession from "@/hooks/useSession";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session, isFetching } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && !isFetching) {
      router.push("/login");
    }
  }, [session, router, isFetching]);

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex justify-between w-full p-4">
        <div />
        {!!session && (
          <Link href="/private/logout">
            <div className="border border-gray-300 p-2 px-6 rounded-md">
              Logout
            </div>
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
