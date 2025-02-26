import { Inter } from "next/font/google";
import "./styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Advisor Dashboard - Compound Planning",
  description: "Dashboard for financial advisors at Compound Planning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  );
}