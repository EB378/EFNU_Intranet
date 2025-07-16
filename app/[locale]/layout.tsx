// app/[locale]/layout.tsx
import { cookies } from "next/headers";
import { Providers } from "@components/Layout/providers";
import { Metadata, Viewport } from "next";
import { APP_NAME, APP_DEFAULT_TITLE, APP_TITLE_TEMPLATE, APP_DESCRIPTION, defaultUrl } from "@/constants";
import Pwa from "@components/pwa";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  metadataBase: new URL(defaultUrl),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  icons: { icon: "/favicon.ico" },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: { default: APP_DEFAULT_TITLE, template: APP_TITLE_TEMPLATE },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: { default: APP_DEFAULT_TITLE, template: APP_TITLE_TEMPLATE },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const theme = cookies().get("theme")?.value;
  const defaultMode = theme === "dark" ? "dark" : "light";

  return (
    <html lang={locale}>
      <body>
        <Providers defaultMode={defaultMode} locale={locale}>
          {children}
        </Providers>
        <Pwa/>
      </body>
    </html>
  );
}
