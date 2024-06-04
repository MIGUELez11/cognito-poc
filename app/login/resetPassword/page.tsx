"use client";

import { resetPassword } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

function useOnSubmit() {
  const router = useRouter();

  return async ({ email }: { email: string }) => {
    await resetPassword({
      username: email,
    });

    router.push(`/login/newPasswordWithCode?email=${email}`);
  };
}

export default function ResetPassword() {
  const params = useSearchParams();
  const email = params.get("email");

  const form = useForm({
    defaultValues: {
      email: email ?? "",
      confirmEmail: email ?? "",
    },
  });

  const onSubmit = useOnSubmit();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <form
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold">Reset password</h1>
        <input
          type="text"
          placeholder="Email"
          className="w-80 p-2 text-gray-700"
          {...form.register("email")}
        />
        <input
          type="text"
          placeholder="Confirm Email"
          className="w-80 p-2 text-gray-700"
          {...form.register("confirmEmail", {
            validate: (value) => value === form.getValues("email"),
          })}
        />
        <button
          type="submit"
          className="w-80 border border-gray-300 rounded-md p-2"
        >
          Reset password
        </button>
      </form>
    </div>
  );
}
