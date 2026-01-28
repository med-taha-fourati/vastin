import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const funnelDisplaySans = Funnel_Display({
  variable: "--font-funnel-display-sans",
});

export const metadata: Metadata = {
  title: "Vastin",
  description: "Video Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${funnelDisplaySans.className} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
