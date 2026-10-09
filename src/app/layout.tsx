import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { Providers } from "@/components/providers";
import { app } from "@/config/app";

const fontSans = localFont({
  src: [
    {
      path: "../fonts/InterVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/InterVariable-Italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
});

const fontMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-docs-mono",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(app.url),
  title: {
    default: app.name,
    template: `%s / ${app.name}`,
  },
  description: app.description,
  openGraph: {
    type: "website",
    siteName: app.name,
    title: app.name,
    description: app.description,
    url: app.url,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const acceptLanguage = (await headers()).get("accept-language");
  const lang = acceptLanguage?.split(/[,;]/)[0] || "en-US";
  return (
    <html
      dir="ltr"
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-svh font-sans antialiased">
        <Providers lang={lang}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
