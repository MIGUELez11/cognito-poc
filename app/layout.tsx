import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "@/providers/QueryClientProvider";
import AmplifyProvider from "@/providers/AmplifyProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cognito Proof of Concept",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <AmplifyProvider>{children}</AmplifyProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}