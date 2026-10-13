import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { AppBootstrap } from "@/components/app-bootstrap";
import { JsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import { app, META_THEME_COLORS } from "@/config/app";

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

const fontMono = localFont({
  src: [
    {
      path: "../fonts/PaperMono[wght].woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${app.site.url}/#organization`,
        name: "Intent UI",
        url: app.site.url,
        sameAs: [app.links.twitter, app.links.github, app.links.discord],
      },
      {
        "@type": "WebSite",
        "@id": `${app.url}/#website`,
        url: app.url,
        name: app.name,
        description: app.description,
        publisher: { "@id": `${app.site.url}/#organization` },
      },
    ],
  };

  return (
    <html
      dir="ltr"
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={structuredData} />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
        {/* Apply the saved theme before the first paint so dark mode does not flash. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, trusted script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("intentui-theme")||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.add(d?"dark":"light")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-svh font-sans antialiased">
        <Providers lang="en-US">
          <AppBootstrap />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
