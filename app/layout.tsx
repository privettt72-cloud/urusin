
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.urusin.biz.id"),

  title: {
    default: "Urusin — Tools Digital untuk Kebutuhan Sehari-hari",
    template: "%s | Urusin",
  },

  description:
    "Urusin menyediakan berbagai tools digital gratis untuk kebutuhan sehari-hari seperti membuat CV ATS, surat lamaran kerja, resize foto, compress foto, kalkulator gaji, THR, diskon, dan cicilan.",

  keywords: [
    "urusin",
    "tools online",
    "tools gratis",
    "buat CV ATS",
    "CV ATS",
    "surat lamaran kerja",
    "surat resign",
    "resize foto",
    "foto 3x4",
    "foto 4x6",
    "compress foto",
    "kalkulator gaji",
    "kalkulator THR",
    "kalkulator diskon",
    "kalkulator cicilan",
  ],

  authors: [
    {
      name: "Urusin",
    },
  ],

  creator: "Urusin",

  applicationName: "Urusin",

  generator: "Next.js",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id",
    siteName: "Urusin",
    title: "Urusin — Tools Digital untuk Kebutuhan Sehari-hari",
    description:
      "Buat CV, surat lamaran, resize foto, compress foto, hitung gaji, THR, diskon, cicilan, dan berbagai kebutuhan lainnya dengan mudah.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Urusin — Tools Digital untuk Kebutuhan Sehari-hari",
    description:
      "Kumpulan tools digital sederhana untuk membantu menyelesaikan kebutuhan sehari-hari.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
  icon: "/logo.png?v=2",
  shortcut: "/logo.png?v=2",
  apple: "/logo.png?v=2",
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-26K8TL5MDM"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-26K8TL5MDM');
          `}
        </Script>
      </body>
    </html>
  );
}

