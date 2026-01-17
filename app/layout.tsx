import type { Metadata } from "next";
import { Pixelify_Sans, Poppins } from "next/font/google";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "leaflet/dist/leaflet.css";
import { LanguageProvider } from "./providers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-pixelify-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seibeldev.com.br"),
  title: "Joao Seibel",
  description: "Software engineer at RaioWeb based in Porto Alegre, Brazil.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  },
  openGraph: {
    title: "Joao Seibel",
    description: "Software engineer at RaioWeb based in Porto Alegre, Brazil.",
    url: "https://seibeldev.com.br",
    siteName: "Joao Seibel",
    locale: "pt-BR",
    type: "website",
    images: [
      {
        url: "/images/og-image.png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Joao Seibel",
    description: "Software engineer at RaioWeb based in Porto Alegre, Brazil.",
    images: ["/images/og-image.png"]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${poppins.variable} ${pixelify.variable} font-sans`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
