import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Developer Portfolio", template: "%s — Developer Portfolio" },
  description: "Software developer portfolio and selected project work.",
  keywords: ["Software Developer", "Portfolio"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark" data-scroll-behavior="smooth"><body className="antialiased">{children}</body></html>;
}
