import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pisah PDF Online Gratis",

  description:
    "Pisahkan halaman PDF secara online dan gratis. Pilih halaman tertentu dari file PDF, buat PDF baru, dan download langsung dari browser tanpa upload ke server.",

  keywords: [
    "pisah pdf",
    "pisah pdf online",
    "split pdf",
    "split pdf online",
    "memisahkan pdf",
    "cara memisahkan pdf",
    "ambil halaman pdf",
    "pisahkan halaman pdf",
    "extract halaman pdf",
    "pisah file pdf",
    "pisah pdf gratis",
  ],

  alternates: {
    canonical: "/pisah-pdf",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id/pisah-pdf",
    siteName: "Urusin",
    title: "Pisah PDF Online Gratis | Urusin",
    description:
      "Pilih halaman tertentu dari PDF dan buat file PDF baru secara gratis. Proses langsung di browser tanpa upload ke server.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Pisah PDF Online Gratis | Urusin",
    description:
      "Pisahkan halaman PDF dengan mudah, gratis, dan langsung dari browser.",
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

export default function PisahPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}