"use client";

import { signIn } from "aws-amplify/auth";
import { signInWithRedirect } from "aws-amplify/auth/cognito";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

function useHandleLogin() {
  const router = useRouter();

  return useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const user = await signIn({
          username: email,
          password: password,
        });

        console.log("user", user);

        if (user.isSignedIn) {
          return;
        }

        switch (user.nextStep.signInStep) {
          case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
            router.push("/login/newPassword");
            break;
          case "RESET_PASSWORD":
            router.push(`/login/newPasswordWithCode?email=${email}`);
            break;
          case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
            router.push("/login/totp");
            break;
          default:
            throw new Error("Invalid sign in step");
        }
      } catch (error) {
        alert("Error logging in");
        console.log(error);
      }
    },
    [router]
  );
}

function signInWithRedirectTo(provider: string) {
  return async () => {
    await signInWithRedirect({
      provider: { custom: provider },
    });
  };
}

export default function LoginPage() {
  const handleLogin = useHandleLogin();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = form.watch("email");

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="absolute top-0 right-0 p-4">
        <Link href="/authenticator">
          <button className="bg-blue-500 text-white p-2 px-6 rounded-md">
            Go to cognito form
          </button>
        </Link>
      </div>
      <form onSubmit={form.handleSubmit(handleLogin)}>
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold">Login</h1>
          <input
            type="email"
            className="w-80 p-2 text-gray-700"
            placeholder="Email"
            {...form.register("email")}
          />
          <input
            type="password"
            className="w-80 p-2 text-gray-700"
            placeholder="Password"
            {...form.register("password")}
          />
          <Link
            href={
              email
                ? `/login/resetPassword?email=${email}`
                : "/login/resetPassword"
            }
            className="w-full underline px-2"
          >
            Forgot password?
          </Link>
          <button className="w-80 border border-gray-300 rounded-md p-2">
            Login
          </button>
        </div>
      </form>
      <div className="border-t border-gray-300 w-96 h-0" />
      <div className="flex flex-col items-center justify-center gap-4">
        <button
          className="w-80 border border-gray-300 rounded-md p-2"
          onClick={signInWithRedirectTo("Google")}
        >
          Login with Google
        </button>
        <button
          className="w-80 border border-gray-300 rounded-md p-2"
          onClick={signInWithRedirectTo("MockSAML")}
        >
          Login with SAML
        </button>
      </div>
    </div>
  );
}
