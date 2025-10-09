import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { RootLayoutContent } from "@/components/RootLayoutContent";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  width: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutContent locale="zh">{children}</RootLayoutContent>;
}
