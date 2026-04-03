import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-inter' });
const manrope = Manrope({ subsets: ["latin"], display: 'swap', variable: '--font-manrope' });

export const metadata: Metadata = {
  title: "Nutrizi | Dashboard Ahli Gizi",
  description: "Modul Perencanaan Makan Bergizi Gratis (MBG) untuk Ahli Gizi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body min-h-full bg-background text-on-surface">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
