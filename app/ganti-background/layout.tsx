import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ganti Background Foto Online Gratis",
  description:
    "Hapus dan ganti background foto secara online gratis. Pilih background putih, merah, biru, atau transparan dengan proses langsung di browser.",
  keywords: [
    "ganti background foto",
    "ganti background foto online",
    "hapus background foto",
    "hapus background online",
    "background foto merah",
    "background foto biru",
    "background foto putih",
    "ubah background foto",
    "ganti background pas foto",
    "pas foto background merah",
    "pas foto background biru",
    "remove background foto",
    "remove background online",
  ],
  alternates: {
    canonical: "/ganti-background",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id/ganti-background",
    siteName: "Urusin",
    title: "Ganti Background Foto Online Gratis | Urusin",
    description:
      "Hapus background foto dan ganti dengan warna putih, merah, biru, atau transparan langsung dari browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ganti Background Foto Online Gratis | Urusin",
    description:
      "Hapus dan ganti background foto secara gratis langsung dari browser.",
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

export default function GantiBackgroundLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}