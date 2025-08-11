import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nightreign Buddy",
  description: "Helper app for Elden Ring Nightreign",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}