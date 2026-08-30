
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resize Foto 3×4, 4×6, 2×3 Gratis",

  description:
    "Ubah ukuran foto menjadi 3×4, 4×6, 2×3 atau ukuran custom secara gratis dengan Urusin. Atur posisi dan zoom foto, pilih JPG atau PNG, lalu download hasilnya langsung dari browser.",

  keywords: [
    "resize foto",
    "resize foto online",
    "resize foto gratis",
    "ubah ukuran foto",
    "ukuran foto 3x4",
    "foto 3x4",
    "foto 4x6",
    "foto 2x3",
    "resize foto 3x4",
    "resize foto 4x6",
    "pas foto 3x4",
    "pas foto 4x6",
  ],

  alternates: {
    canonical: "/resize-foto",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id/resize-foto",
    siteName: "Urusin",
    title: "Resize Foto 3×4, 4×6, 2×3 Gratis | Urusin",
    description:
      "Ubah ukuran foto menjadi 3×4, 4×6, 2×3 atau ukuran custom. Atur foto dan download hasilnya langsung dari browser.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Resize Foto 3×4, 4×6, 2×3 Gratis | Urusin",
    description:
      "Resize foto dengan mudah untuk kebutuhan pas foto dan dokumen.",
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

export default function ResizeFotoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

