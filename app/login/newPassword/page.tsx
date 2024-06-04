"use client";

import { confirmSignIn } from "aws-amplify/auth";
import { useForm } from "react-hook-form";

function onSubmit({ password }: { password: string }) {
  confirmSignIn({
    challengeResponse: password,
  });
}

export default function NewPassword() {
  const form = useForm<{ password: string; confirmPassword: string }>();

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="text-3xl font-bold">New password required</h1>
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
            Confirm Password
          </button>
        </form>
      </div>
    </div>
  );
}
