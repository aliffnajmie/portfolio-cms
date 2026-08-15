import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: { default: "Aliff Najmie — Software Developer", template: "%s — Aliff Najmie" },
  description: "Portfolio of Aliff Najmie, a software developer building clear, reliable, and thoughtful digital products.",
  keywords: ["Aliff Najmie", "Software Developer", "Portfolio", "Next.js", "Web Development"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark" data-scroll-behavior="smooth"><body className="antialiased">{children}</body></html>;
}
