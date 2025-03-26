import { Inter } from "next/font/google";
import "./styles/globals.css";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Advisor Dashboard - Wealth Dynamics",
  description: "Dashboard for financial advisors at Wealth Dynamics",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  );
}