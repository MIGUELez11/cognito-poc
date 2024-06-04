"use client";

import { confirmResetPassword } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

function useOnSubmit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return async ({ code, password }: { code: string; password: string }) => {
    await confirmResetPassword({
      username: email!,
      newPassword: password,
      confirmationCode: code,
    });

    router.push("/login");
  };
}

export default function NewPasswordWithCode() {
  const form = useForm<{
    code: string;
    password: string;
    confirmPassword: string;
  }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = useOnSubmit();

  if (!searchParams.has("email")) {
    router.push("/login/resetPassword");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <form
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold">Password reset</h1>
        <input
          type="text"
          className="w-80 p-2 text-gray-700"
          placeholder="Code"
          {...form.register("code")}
        />
        <input
          type="password"
          className="w-80 p-2 text-gray-700"
          placeholder="Password"
          {...form.register("password")}
        />
        <input
          type="password"
          className="w-80 p-2 text-gray-700"
          placeholder="Confirm Password"
          {...form.register("confirmPassword", {
            validate: (value) => value === form.getValues("password"),
          })}
        />
        <button className="w-80 border border-gray-300 rounded-md p-2">
          Confirm New Password
        </button>
      </form>
    </div>
  );
}
