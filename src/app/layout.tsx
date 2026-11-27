import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#3d261d",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL("https://thedailyknead.id"),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "https://thedailyknead.id",
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/hero-banner.png",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Google Fonts: Playfair Display & Plus Jakarta Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Google Material Symbols */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased selection:bg-secondary-container selection:text-primary font-body">
        {children}
      </body>
    </html>
  );
}
