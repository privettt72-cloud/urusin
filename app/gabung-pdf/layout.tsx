import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gabung PDF Online Gratis",

  description:
    "Gabungkan beberapa file PDF menjadi satu secara online dan gratis. Atur urutan PDF dan download hasilnya langsung dari browser tanpa upload ke server.",

  keywords: [
    "gabung pdf",
    "gabung pdf online",
    "menggabungkan pdf",
    "gabungkan pdf",
    "merge pdf",
    "merge pdf online",
    "cara menggabungkan pdf",
    "gabung file pdf",
    "gabung beberapa pdf",
    "gabung pdf gratis",
  ],

  alternates: {
    canonical: "/gabung-pdf",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id/gabung-pdf",
    siteName: "Urusin",
    title: "Gabung PDF Online Gratis | Urusin",
    description:
      "Gabungkan beberapa file PDF menjadi satu dengan mudah. Atur urutan PDF dan download langsung dari browser.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Gabung PDF Online Gratis | Urusin",
    description:
      "Gabungkan beberapa file PDF menjadi satu secara gratis dan langsung dari browser.",
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

export default function GabungPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}