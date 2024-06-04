"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";

export default function AuthenticatorPage() {
  return (
    <div className="bg-white flex justify-center items-center h-screen">
      <div className="absolute top-0 right-0 p-4">
        <Link href="/login">
          <button className="bg-blue-500 text-white p-2 px-6 rounded-md">
            Go to login
          </button>
        </Link>
      </div>
      <Authenticator />
    </div>
  );
}
