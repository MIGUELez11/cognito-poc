"use client";

import useSession from "@/hooks/useSession";
import { useQueryClient } from "@tanstack/react-query";
import {
  setUpTOTP,
  updateMFAPreference,
  verifyTOTPSetup,
} from "aws-amplify/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";

function MultiFactorAuth() {
  const { data: session } = useSession();
  const [qrCode, setQRCode] = useState<string | null>(null);
  const form = useForm();
  const queryClient = useQueryClient();

  if (session?.user?.identities?.length) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <div>
          <button
            className="bg-gray-500 text-white p-2 px-6 rounded-md"
            disabled
          >
            MFA can&apos;t be enabled for this user
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {!qrCode && (
        <div>
          <button
            disabled={!!session?.mfa?.enabled}
            className="bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 px-6 rounded-md"
            onClick={async () => {
              const { getSetupUri } = await setUpTOTP();
              const qrCode = getSetupUri("Leemons", session?.user?.email);
              setQRCode(qrCode.href);
            }}
          >
            {session?.mfa?.enabled ? "MFA already enabled" : "Enable MFA"}
          </button>
        </div>
      )}

      {!!qrCode && (
        <form
          onSubmit={form.handleSubmit(async ({ code }) => {
            try {
              await verifyTOTPSetup({
                code,
              });

              await updateMFAPreference({
                totp: "PREFERRED",
              });

              await queryClient.invalidateQueries({
                queryKey: ["session"],
              });

              setQRCode(null);
            } catch (error) {
              alert("Invalid code");
            }
          })}
        >
          <div className="flex flex-col gap-8 w-64">
            <div className="flex">
              <div className="bg-white p-4 rounded-md">
                <QRCode value={qrCode} size={224} />
              </div>
            </div>
            <div className="flex gap-2">
              <input
                placeholder="Enter TOTP code"
                className="w-full p-2 text-gray-700"
                {...form.register("code")}
              />
              <button
                type="submit"
                className="border border-gray-300 rounded-md p-2 px-5"
              >
                Verify
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

function UserInfo() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col whitespace-nowrap w-min border border-gray-200 mx-4 p-4 gap-2">
      <p>
        <b>User ID:</b> {session?.userId}
      </p>
      <p>
        <b>username:</b> {session?.username}
      </p>
      {session?.user &&
        Object.entries(session.user).map(([key, value]) => (
          <p key={key}>
            <b>{key}:</b> {value}
          </p>
        ))}
    </div>
  );
}

export default function PrivatePage() {
  return (
    <div className="flex flex-col gap-4 p-2">
      <UserInfo />
      <MultiFactorAuth />
    </div>
  );
}
