"use client";

import { confirmSignIn } from "aws-amplify/auth";
import { useForm } from "react-hook-form";

function onSubmit({ code }: { code: string }) {
  confirmSignIn({
    challengeResponse: code,
  });
}

export default function TOTP() {
  const form = useForm<{ code: string }>();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <form
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold">MFA Authentication</h1>
        <input
          type="text"
          className="w-80 p-2 text-gray-700"
          placeholder="Code"
          {...form.register("code")}
        />
        <button className="w-80 border border-gray-300 rounded-md p-2">
          Confirm
        </button>
      </form>
    </div>
  );
}
