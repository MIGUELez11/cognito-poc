"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Amplify } from "aws-amplify";
import { Hub } from "aws-amplify/utils";
import { useEffect } from "react";

export default function AmplifyProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = useQueryClient();
  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
          userPoolClientId: process.env.NEXT_PUBLIC_APP_CLIENT_ID!,
          signUpVerificationMethod: "code",
          loginWith: {
            oauth: {
              domain: `${process.env.NEXT_PUBLIC_APP_PREFIX}.auth.${process.env.NEXT_PUBLIC_AWS_REGION}.amazoncognito.com`,
              scopes: [
                "email",
                "openid",
                "profile",
                "aws.cognito.signin.user.admin",
              ],
              redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGNIN!],
              redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGNOUT!],
              responseType: "code",
              providers: ["Google", { custom: "MockSAML" }],
            },

            email: true,
          },
          mfa: {
            totpEnabled: true,
            status: "optional",
          },
        },
      },
    });
  }, []);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", async ({ payload: { event } }) => {
      switch (event) {
        case "signedOut":
        case "signedIn":
          queryClient.invalidateQueries({ queryKey: ["session"] });
          break;
      }
    });

    return unsubscribe;
  }, [queryClient]);

  return children;
}
