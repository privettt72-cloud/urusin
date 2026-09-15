import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kompres PDF Online Gratis",

  description:
    "Kompres dan perkecil ukuran PDF secara online dan gratis. Optimalkan file PDF langsung dari browser tanpa upload ke server.",

  keywords: [
    "kompres pdf",
    "kompres pdf online",
    "compress pdf",
    "compress pdf online",
    "perkecil ukuran pdf",
    "mengecilkan ukuran pdf",
    "cara kompres pdf",
    "cara mengecilkan ukuran pdf",
    "kompres file pdf",
    "perkecil file pdf",
    "kompres pdf gratis",
  ],

  alternates: {
    canonical: "/kompres-pdf",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id/kompres-pdf",
    siteName: "Urusin",
    title: "Kompres PDF Online Gratis | Urusin",
    description:
      "Perkecil ukuran file PDF dengan mudah dan gratis. Proses langsung di browser tanpa upload ke server.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kompres PDF Online Gratis | Urusin",
    description:
      "Perkecil ukuran PDF secara gratis dan langsung dari browser.",
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
};

export default function KompresPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}