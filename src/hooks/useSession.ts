"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AuthError,
  AuthUser,
  fetchMFAPreference,
  FetchMFAPreferenceOutput,
  fetchUserAttributes,
  FetchUserAttributesOutput,
  getCurrentUser,
} from "aws-amplify/auth";

type Session = AuthUser & {
  user?: FetchUserAttributesOutput;
  mfa?: FetchMFAPreferenceOutput;
};

export default function useSession() {
  const queryKey = ["session"];

  return useQuery<Session | null>({
    queryKey,
    queryFn: async () => {
      try {
        const session: Session = await getCurrentUser();

        try {
          session.user = await fetchUserAttributes();
        } catch (error) {
          console.log("Error fetching user attributes", error);
        }

        try {
          session.mfa = await fetchMFAPreference();
        } catch (error) {
          console.log("Error fetching MFA preference", error);
        }

        return session;
      } catch (error) {
        if (
          error instanceof AuthError &&
          (error.name === "NotAuthorizedException" ||
            error.name === "UserUnAuthenticatedException")
        ) {
          return null;
        }

        throw error;
      }
    },
    retry: false,
  });
}
