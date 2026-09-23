"use client";

import { useMemo, useState } from "react";

type Category = "Kerja" | "Foto" | "Dokumen" | "Keuangan";

type Tool = {
  icon: string;
  title: string;
  description: string;
  href: string;
  category: Category;
  popular?: boolean;
};

const tools: Tool[] = [
  {
    icon: "📄",
    title: "Buat CV ATS",
    description:
      "Buat CV profesional yang mudah dibaca sistem ATS.",
    href: "/cv",
    category: "Kerja",
    popular: true,
  },
  {
    icon: "💼",
    title: "Asisten Cari Kerja",
    description:
      "Cari lowongan kerja berdasarkan posisi dan kota, lalu lanjutkan proses lamaran.",
    href: "/asisten-cari-kerja",
    category: "Kerja",
    popular: true,
  },
  {
    icon: "💼",
    title: "Surat Lamaran",
    description:
      "Buat surat lamaran profesional dari data CV.",
    href: "/surat-lamaran",
    category: "Kerja",
    popular: true,
  },
  {
    icon: "📝",
    title: "Surat Resign",
    description:
      "Buat surat pengunduran diri yang rapi dan profesional.",
    href: "/surat-resign",
    category: "Kerja",
    popular: true,
  },
  {
     icon: "📸",
     title: "Resize Foto",
     description:
      "Ubah ukuran foto menjadi 2×3, 3×4, 4×6 atau custom.",
     href: "/resize-foto",
     category: "Foto",
     popular: true,
  },
  {
     icon: "🗜️",
     title: "Compress Foto",
     description:
      "Kecilkan ukuran file foto untuk kebutuhan online.",
     href: "/compress-foto",
     category: "Foto",
     popular: true,
  },

  {
     icon: "📄",
     title: "Foto ke PDF",
     description:
      "Gabungkan beberapa foto menjadi satu file PDF secara gratis.",
     href: "/foto-ke-pdf",
     category: "Dokumen",
     popular: false,
  },
  {
     icon: "📷",
      title: "Scan Dokumen",
     description:
      "Scan foto dokumen secara otomatis dan luruskan perspektif langsung dari browser.",
    href: "/scan-dokumen",
     category: "Dokumen",
     popular: false,
  },
  {  
     icon: "🗜️",
     title: "Kompres PDF",
     description:
     "Perkecil ukuran file PDF dengan mudah langsung dari browser.",
     href: "/kompres-pdf",
     category: "Dokumen",
     popular: false,
  },
  {
      icon: "🔗",
      title: "Gabung PDF",
     description:
     "Gabungkan beberapa file PDF menjadi satu dengan mudah.",
     href: "/gabung-pdf",
     category: "Dokumen",
     popular: false,

  },   
  {
     icon: "🔍",
     title: "Foto ke Teks",
     description:
     "Ambil teks dari foto atau gambar menggunakan OCR langsung dari browser.",
     href: "/foto-ke-teks",
     category: "Dokumen",
     popular: false,
  },
  {

    icon: "✂️",
    title: "Pisah PDF",
    description:
      "Pilih halaman tertentu dari PDF dan buat file PDF baru dengan mudah.",
    href: "/pisah-pdf",
    category: "Dokumen",
    popular: false,
  },
  {
    icon: "💰",
    title: "Catat Keuangan",
    description:
      "Catat pemasukan dan pengeluaran untuk mengatur keuangan sehari-hari.",
    href: "/keuangan",
    category: "Keuangan",
    popular: false,
  },
  {
    icon: "🧾",
    title: "Buat Invoice Online",
    description:
      "Buat invoice profesional untuk bisnis, freelance, jasa, dan UMKM.",
    href: "/invoice",
    category: "Keuangan",
    popular: false,
  },
  {
    icon: "💰",
    title: "Kalkulator Gaji",
    description:
      "Hitung perkiraan pendapatan dan gaji bersih.",
    href: "/kalkulator-gaji",
    category: "Keuangan",
    popular: true,
  },
  {
    icon: "🎁",
    title: "Kalkulator THR",
    description:
      "Hitung perkiraan THR berdasarkan masa kerja.",
    href: "/kalkulator-thr",
    category: "Keuangan",
    popular: true,
  },
  {
    icon: "💸",
    title: "Kalkulator Diskon",
    description:
      "Hitung harga setelah diskon dan jumlah penghematan.",
    href: "/kalkulator-diskon",
    category: "Keuangan",
    popular: true,
  },
  {
    icon: "💳",
    title: "Kalkulator Cicilan",
    description:
      "Hitung estimasi cicilan, bunga, dan total pembayaran.",
    href: "/kalkulator-cicilan",
    category: "Keuangan",
    popular: true,
  },
];

const categories: {
  name: Category;
  icon: string;
  description: string;
}[] = [
  {
    name: "Kerja",
    icon: "💼",
    description:
      "Bantu persiapkan kebutuhan melamar dan bekerja.",
  },
  {
    name: "Foto",
    icon: "📸",
    description:
      "Urus ukuran dan file foto untuk berbagai kebutuhan.",
  },
  {
    name: "Dokumen",
    icon: "📄",
    description:
      "Kelola, ubah, dan rapikan berbagai dokumen dengan mudah.",
  },
  {
    name: "Keuangan",
    icon: "💰",
    description:
      "Hitung berbagai kebutuhan finansial sehari-hari.",
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "Semua" | Category
  >("Semua");

  const filteredTools = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesSearch =
        keyword === "" ||
        tool.title.toLowerCase().includes(keyword) ||
        tool.description.toLowerCase().includes(keyword) ||
        tool.category.toLowerCase().includes(keyword);

      const matchesCategory =
        activeCategory === "Semua" ||
        tool.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const popularTools = tools.filter(
    (tool) => tool.popular
  );

  function scrollToTools() {
    document
      .getElementById("tools")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  function chooseCategory(category: Category) {
    setSearch("");
    setActiveCategory(category);

    setTimeout(() => {
      scrollToTools();
    }, 50);
  }

  function quickSearch(keyword: string) {
    setSearch(keyword);
    setActiveCategory("Semua");

    setTimeout(() => {
      scrollToTools();
    }, 50);
  }

  function showAllTools() {
    setSearch("");
    setActiveCategory("Semua");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <a
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Urusin
            <span className="text-blue-600">.</span>
          </a>

          <nav className="hidden items-center gap-2 sm:flex">

            <a
              href="#tools"
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Tools
            </a>

            <a
              href="#kategori"
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Kategori
            </a>

          </nav>

        </div>

      </header>


      {/* ========================================
          HERO
      ======================================== */}

      <section className="overflow-hidden bg-white">

        <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:pb-24 md:pt-24">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-5 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              ✨ Alat digital untuk kebutuhan sehari-hari
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">

              Selesaikan urusanmu
              <br />

              <span className="text-blue-600">
                dengan lebih mudah.
              </span>

            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">

              Buat CV, surat lamaran, ubah ukuran
              foto, hitung gaji, THR, cicilan,
              dan berbagai kebutuhan lainnya
              dalam satu tempat.

            </p>


            {/* SEARCH */}

            <div className="mx-auto mt-8 max-w-2xl">

              <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">

                <span className="px-3 text-xl">
                  🔍
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setActiveCategory("Semua");
                  }}
                  placeholder="Cari tools yang kamu butuhkan..."
                  className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none md:text-base"
                  aria-label="Cari tools"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("Semua");
                    }}
                    className="mr-1 rounded-lg px-3 py-2 text-sm font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Hapus pencarian"
                  >
                    ✕
                  </button>
                )}

              </div>

            </div>


            {/* QUICK SEARCH */}

            <div className="mt-5 flex flex-wrap justify-center gap-2">

              <button
                type="button"
                onClick={() => quickSearch("CV")}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
              >
                📄 CV
              </button>

              <button
                type="button"
                onClick={() => quickSearch("Foto")}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
              >
                📸 Foto
              </button>

              <button
                type="button"
                onClick={() => quickSearch("Gaji")}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
              >
                💰 Gaji
              </button>

              <button
                type="button"
                onClick={() => quickSearch("THR")}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
              >
                🎁 THR
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          POPULAR
      ======================================== */}

      <section className="mx-auto max-w-6xl px-5 py-14">

        <div className="mb-7 flex items-end justify-between gap-4">

          <div>

            <div className="mb-2 text-sm font-black text-blue-600">
              🔥 Populer
            </div>

            <h2 className="text-2xl font-black tracking-tight md:text-3xl">
              Paling sering digunakan
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tools yang mungkin sedang kamu butuhkan.
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              showAllTools();
              scrollToTools();
            }}
            className="hidden rounded-xl px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-50 sm:block"
          >
            Lihat semua →
          </button>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {popularTools
            .slice(0, 4)
            .map((tool) => (
              <ToolCard
                key={tool.href}
                tool={tool}
              />
            ))}

        </div>

      </section>


      {/* ========================================
          CATEGORY
      ======================================== */}

      <section
        id="kategori"
        className="border-y border-slate-200 bg-white"
      >

        <div className="mx-auto max-w-6xl px-5 py-14">

          <div className="mb-8">

            <div className="mb-2 text-sm font-black text-blue-600">
              📂 Kategori
            </div>

            <h2 className="text-2xl font-black tracking-tight md:text-3xl">
              Cari berdasarkan kebutuhan
            </h2>

          </div>


          <div className="grid gap-4 md:grid-cols-4">

            {categories.map((category) => (

              <button
                key={category.name}
                type="button"
                onClick={() =>
                  chooseCategory(category.name)
                }
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-blue-50">
                  {category.icon}
                </div>

                <h3 className="text-lg font-black">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {category.description}
                </p>

                <div className="mt-5 text-sm font-black text-blue-600">
                  Lihat tools →
                </div>

              </button>

            ))}

          </div>

        </div>

      </section>


      {/* ========================================
          ALL TOOLS
      ======================================== */}

      <section
        id="tools"
        className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14"
      >

        <div className="mb-7">

          <div className="mb-2 text-sm font-black text-blue-600">
            🧰 Semua Tools
          </div>

          <h2 className="text-2xl font-black tracking-tight md:text-3xl">
            Semua kebutuhan dalam satu tempat
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Pilih tools yang ingin kamu gunakan.
          </p>

        </div>


        {/* FILTER */}

        <div className="mb-8 flex flex-wrap gap-2">

          {[
            "Semua",
            "Kerja",
            "Foto",
            "Dokumen",
            "Keuangan",
          ].map((category) => (

            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(
                  category as "Semua" | Category
                );

                setSearch("");
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
              }`}
            >
              {category}
            </button>

          ))}

        </div>


        {/* HASIL */}

        {filteredTools.length > 0 ? (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.href}
                tool={tool}
              />
            ))}

          </div>

        ) : (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

            <div className="text-4xl">
              🔍
            </div>

            <h3 className="mt-4 text-lg font-black">
              Tools tidak ditemukan
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Tidak ada tools yang cocok dengan
              pencarian kamu. Coba gunakan kata
              kunci lain.
            </p>

            <button
              type="button"
              onClick={showAllTools}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
            >
              Tampilkan Semua
            </button>

          </div>

        )}

      </section>


      {/* ========================================
          CTA
      ======================================== */}

      <section className="px-5 pb-16">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-slate-900">

          <div className="px-6 py-12 text-center text-white md:px-12 md:py-16">

            <div className="text-4xl">
              ✨
            </div>

            <h2 className="mt-4 text-2xl font-black md:text-3xl">
              Mau mulai dari mana?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
              Pilih salah satu tools Urusin dan
              selesaikan kebutuhanmu dengan lebih
              cepat.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">

              <a
                href="/cv"
                className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-100"
              >
                📄 Buat CV
              </a>

              <a
                href="/resize-foto"
                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                📸 Resize Foto
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-6xl px-5 py-10">

          <div className="grid gap-8 md:grid-cols-3">

            {/* BRAND */}

            <div>

              <a
                href="/"
                className="text-xl font-black"
              >
                Urusin
                <span className="text-blue-600">
                  .
                </span>
              </a>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Kumpulan alat digital sederhana
                untuk membantu menyelesaikan
                kebutuhan sehari-hari.
              </p>

            </div>


            {/* KERJA */}

            <div>

              <h3 className="font-black">
                Kerja
              </h3>

              <div className="mt-3 space-y-2 text-sm">

                <FooterLink
                  href="/cv"
                  text="Buat CV ATS"
                />

                <FooterLink
                  href="/surat-lamaran"
                  text="Surat Lamaran"
                />

                <FooterLink
                  href="/surat-resign"
                  text="Surat Resign"
                />

              </div>

            </div>


            {/* FOTO & KEUANGAN */}

            <div>

              <h3 className="font-black">
                Tools
              </h3>

              <div className="mt-3 space-y-2 text-sm">

                <FooterLink
                  href="/resize-foto"
                  text="Resize Foto"
                />

                <FooterLink
                  href="/compress-foto"
                  text="Compress Foto"
                />

                <FooterLink
                  href="/foto-ke-pdf"
                  text="Foto ke PDF"
                />

                <FooterLink
                  href="/scan-dokumen"
                  text="Scan Dokumen"
                />

                <FooterLink
                  href="/pisah-pdf"
                  text="Pisah PDF"
                />

                <FooterLink
                  href="/keuangan"
                  text="Catat Keuangan"
                />

                <FooterLink
                  href="/invoice"
                  text="Buat Invoice Online"
                />

                <FooterLink
                  href="/kalkulator-gaji"
                  text="Kalkulator Gaji"
                />

                <FooterLink
                  href="/kalkulator-thr"
                  text="Kalkulator THR"
                />

                <FooterLink
                  href="/kalkulator-diskon"
                  text="Kalkulator Diskon"
                />

                <FooterLink
                  href="/kalkulator-cicilan"
                  text="Kalkulator Cicilan"
                />

              </div>

            </div>

          </div>


          <div className="mt-10 border-t border-slate-100 pt-6">

            <p className="text-center text-xs text-slate-400">
              © 2026 Urusin. Semua hak dilindungi.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}


/* ========================================
   TOOL CARD
======================================== */

function ToolCard({
  tool,
}: {
  tool: Tool;
}) {
  return (
    <a
      href={tool.href}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >

      <div className="flex items-start justify-between gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-blue-50">
          {tool.icon}
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
          {tool.category}
        </span>

      </div>


      <h3 className="mt-5 font-black">
        {tool.title}
      </h3>

      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
        {tool.description}
      </p>

      <div className="mt-5 text-sm font-black text-blue-600">
        Gunakan →
      </div>

    </a>
  );
}


/* ========================================
   FOOTER LINK
======================================== */

function FooterLink({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <a
      href={href}
      className="block text-slate-500 transition hover:text-blue-600"
    >
      {text}
    </a>
  );
}