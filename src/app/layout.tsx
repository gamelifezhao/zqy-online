import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Bar from "./dashboard/bar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "别发呆了",
  description: "别发呆了的实验室",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Bar />
        {children}
      </body>
    </html>
  );
}
