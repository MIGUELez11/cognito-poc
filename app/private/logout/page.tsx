"use client";

import useSession from "@/hooks/useSession";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      signOut();
    }
  }, [router, queryClient, session]);
}
