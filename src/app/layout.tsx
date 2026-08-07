import type { Metadata } from "next";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { getSettings, getSocialLinks } from "@/lib/content";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    icons: { icon: "/favicon.ico" },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = await getSocialLinks();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar links={links} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
