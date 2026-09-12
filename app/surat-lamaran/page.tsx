"use client";

import { useEffect, useMemo, useState } from "react";

type Experience = {
  id?: number;
  company?: string;
  position?: string;
  year?: string;
  description?: string;
};

type Education = {
  id?: number;
  school?: string;
  major?: string;
  year?: string;
  description?: string;
};

type StyleType = "formal" | "professional" | "fresh";

const STORAGE_KEY = "urusin-surat-lamaran";

export default function SuratLamaranPage() {
  // ================================
  // DATA CV
  // ================================

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [lokasi, setLokasi] = useState("");

  const [pengalaman, setPengalaman] =
    useState<Experience[]>([]);

  const [pendidikan, setPendidikan] =
    useState<Education[]>([]);

  // ================================
  // TUJUAN LAMARAN
  // ================================

  const [posisi, setPosisi] = useState("");
  const [perusahaan, setPerusahaan] = useState("");
  const [alamatPerusahaan, setAlamatPerusahaan] =
    useState("");

  // ================================
  // GAYA SURAT
  // ================================

  const [style, setStyle] =
    useState<StyleType>("professional");

  // ================================
  // SURAT
  // ================================

  const [surat, setSurat] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  // ================================
  // LOAD DATA CV
  // ================================

  useEffect(() => {
    try {
      const savedCV =
        localStorage.getItem("urusin-cv");

      if (!savedCV) return;

      const data = JSON.parse(savedCV);

      setNama(data.nama || "");
      setEmail(data.email || "");
      setTelepon(data.telepon || "");

      setLokasi(
        data.lokasi ||
          data.kota ||
          ""
      );

      setPengalaman(
        Array.isArray(data.pengalaman)
          ? data.pengalaman
          : []
      );

      setPendidikan(
        Array.isArray(data.pendidikan)
          ? data.pendidikan
          : []
      );
    } catch (error) {
      console.error(
        "Gagal membaca data CV:",
        error
      );
    }
  }, []);

  // ================================
  // LOAD DATA LOWONGAN
  // ================================

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const job = params.get("job");
    const company = params.get("company");
    const location = params.get("location");

    if (!job && !company && !location) return;

    if (job) {
      setPosisi(job);
    }

    if (company) {
      setPerusahaan(company);
    }

    if (location) {
      setLokasi(location);
    }
  }, []);

  // ================================
  // LOAD SURAT TERSIMPAN
  // ================================

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!saved) return;

      const data = JSON.parse(saved);

      setPosisi(data.posisi || "");
      setPerusahaan(
        data.perusahaan || ""
      );
      setAlamatPerusahaan(
        data.alamatPerusahaan || ""
      );

      setStyle(
        data.style || "professional"
      );

      setSurat(data.surat || "");
    } catch (error) {
      console.error(
        "Gagal membaca surat:",
        error
      );
    }
  }, []);

  // ================================
  // AUTO SAVE
  // ================================

  useEffect(() => {
    if (
      !posisi &&
      !perusahaan &&
      !surat
    ) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          posisi,
          perusahaan,
          alamatPerusahaan,
          style,
          surat,
        })
      );

      setSaved(true);

      const timer = setTimeout(() => {
        setSaved(false);
      }, 1500);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error(
        "Gagal menyimpan surat:",
        error
      );
    }
  }, [
    posisi,
    perusahaan,
    alamatPerusahaan,
    style,
    surat,
  ]);

  // ================================
  // DATA PENDUKUNG
  // ================================

  const pendidikanUtama = useMemo(() => {
    return pendidikan.find(
      (item) =>
        item.school ||
        item.major ||
        item.description
    );
  }, [pendidikan]);

  const pengalamanUtama = useMemo(() => {
    return pengalaman.find(
      (item) =>
        item.company ||
        item.position ||
        item.description
    );
  }, [pengalaman]);

  // ================================
  // GENERATOR SURAT
  // ================================

  function generateSurat() {
    if (!nama.trim()) {
      alert(
        "Nama belum tersedia. Silakan isi CV terlebih dahulu."
      );
      return;
    }

    if (!posisi.trim()) {
      alert(
        "Masukkan posisi yang ingin dilamar."
      );
      return;
    }

    if (!perusahaan.trim()) {
      alert(
        "Masukkan nama perusahaan."
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const tanggal =
        new Date().toLocaleDateString(
          "id-ID",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );

      // ==============================
      // PENDIDIKAN
      // ==============================

      let pendidikanText = "";

      if (pendidikanUtama) {
        pendidikanText =
          `Saya merupakan lulusan ${
            pendidikanUtama.major ||
            "program studi"
          } dari ${
            pendidikanUtama.school ||
            "institusi pendidikan"
          }`;

        if (pendidikanUtama.year) {
          pendidikanText +=
            ` pada tahun ${pendidikanUtama.year}`;
        }

        pendidikanText += ".";
      }

      // ==============================
      // PENGALAMAN
      // ==============================

      let pengalamanText = "";

      if (pengalamanUtama) {
        pengalamanText =
          `Saya memiliki pengalaman sebagai ${
            pengalamanUtama.position ||
            "profesional"
          }`;

        if (pengalamanUtama.company) {
          pengalamanText +=
            ` di ${pengalamanUtama.company}`;
        }

        if (pengalamanUtama.year) {
          pengalamanText +=
            ` pada periode ${pengalamanUtama.year}`;
        }

        pengalamanText += ". ";

        pengalamanText +=
          pengalamanUtama.description ||
          "Saya terbiasa bekerja secara bertanggung jawab dan menyelesaikan tugas dengan baik.";
      }

      // ==============================
      // ISI BERDASARKAN GAYA
      // ==============================

      let isiUtama = "";

      // ------------------------------
      // FORMAL
      // ------------------------------

      if (style === "formal") {
        isiUtama = [
          `Dengan ini saya bermaksud mengajukan lamaran pekerjaan untuk posisi ${posisi} di ${perusahaan}.`,
          pendidikanText,
          pengalamanText,
          "Saya memiliki kemampuan untuk bekerja secara bertanggung jawab, menjaga komunikasi yang baik, serta menyelesaikan tugas sesuai dengan target yang diberikan.",
          "Saya sangat berharap dapat diberikan kesempatan untuk mengikuti proses seleksi dan wawancara agar dapat menjelaskan lebih lanjut mengenai kemampuan yang saya miliki.",
        ]
          .filter(Boolean)
          .join("\n\n");
      }

      // ------------------------------
      // PROFESSIONAL
      // ------------------------------

      if (style === "professional") {
        isiUtama = [
          `Saya bermaksud mengajukan lamaran untuk posisi ${posisi} di ${perusahaan}. Saya tertarik dengan kesempatan tersebut dan percaya bahwa kemampuan serta pengalaman yang saya miliki dapat memberikan kontribusi positif bagi perusahaan.`,
          pendidikanText,
          pengalamanText,
          "Saya merupakan pribadi yang bertanggung jawab, mudah beradaptasi, mampu bekerja secara mandiri maupun dalam tim, serta memiliki komitmen untuk terus belajar dan berkembang.",
          "Saya berharap dapat memperoleh kesempatan untuk mengikuti proses seleksi dan wawancara sehingga saya dapat menjelaskan lebih lanjut mengenai pengalaman dan kemampuan yang saya miliki.",
        ]
          .filter(Boolean)
          .join("\n\n");
      }

      // ------------------------------
      // FRESH GRADUATE
      // ------------------------------

      if (style === "fresh") {
        isiUtama = [
          `Saya bermaksud mengajukan lamaran untuk posisi ${posisi} di ${perusahaan}. Saya memiliki ketertarikan yang besar untuk mengembangkan kemampuan dan memulai karier secara profesional di lingkungan kerja yang dinamis.`,
          pendidikanText,
          "Meskipun pengalaman profesional saya masih terbatas, saya memiliki semangat belajar yang tinggi, mampu bekerja sama dengan tim, bertanggung jawab terhadap tugas, dan siap menerima arahan serta tantangan baru.",
          "Saya berharap dapat diberikan kesempatan untuk mengikuti proses seleksi dan wawancara agar saya dapat menunjukkan motivasi dan kemampuan yang saya miliki.",
        ]
          .filter(Boolean)
          .join("\n\n");
      }

      // ==============================
      // SURAT LENGKAP
      // ==============================

      const hasil = [
        `${lokasi || "Kota"}, ${tanggal}`,
        "",
        "Yth. Bapak/Ibu HRD",
        perusahaan,
        alamatPerusahaan || "Di tempat",
        "",
        `Perihal: Lamaran Pekerjaan sebagai ${posisi}`,
        "",
        "Dengan hormat,",
        "",
        "Saya yang bertanda tangan di bawah ini:",
        "",
        `Nama          : ${nama}`,
        `Email         : ${email || "-"}`,
        `No. Telepon   : ${telepon || "-"}`,
        "",
        isiUtama,
        "",
        "Sebagai bahan pertimbangan, saya siap melampirkan CV dan dokumen pendukung lainnya sesuai dengan kebutuhan perusahaan.",
        "",
        `Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya untuk dapat bergabung dan memberikan kontribusi terbaik bagi ${perusahaan}.`,
        "",
        "Atas perhatian dan kesempatan yang diberikan, saya ucapkan terima kasih.",
        "",
        "Hormat saya,",
        "",
        "",
        nama,
      ].join("\n");

      setSurat(hasil);
      setEditMode(false);
      setLoading(false);
    }, 500);
  }

  // ================================
  // COPY
  // ================================

  async function copySurat() {
    if (!surat) {
      alert(
        "Buat surat terlebih dahulu."
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(
        surat
      );

      alert(
        "Surat berhasil disalin."
      );
    } catch (error) {
      console.error(error);

      alert(
        "Gagal menyalin surat."
      );
    }
  }

  // ================================
  // PDF / PRINT
  // ================================

  function printPDF() {
    if (!surat) {
      alert(
        "Buat surat terlebih dahulu."
      );
      return;
    }

    window.print();
  }

  // ================================
  // HAPUS
  // ================================

  function resetSurat() {
    const yakin = confirm(
      "Yakin ingin menghapus surat ini?"
    );

    if (!yakin) return;

    setSurat("");
    setPosisi("");
    setPerusahaan("");
    setAlamatPerusahaan("");
    setEditMode(false);

    localStorage.removeItem(
      STORAGE_KEY
    );
  }

  // ================================
  // AMBIL ISI SURAT UNTUK PREVIEW
  // ================================

  function getIsiSurat() {
    if (!surat) return "";

    const lines = surat.split("\n");

    // Cari baris Perihal
    const perihalIndex =
      lines.findIndex((line) =>
        line.startsWith("Perihal:")
      );

    if (perihalIndex === -1) {
      return surat;
    }

    // Ambil semua isi setelah Perihal
    let isi = lines
      .slice(perihalIndex + 1)
      .join("\n")
      .trim();

    // Hapus tanda tangan
    const signatureIndex =
      isi.indexOf("\nHormat saya,");

    if (signatureIndex !== -1) {
      isi = isi
        .slice(0, signatureIndex)
        .trim();
    }

    return isi;
  }

  // ================================
  // TANGGAL
  // ================================

  const tanggalSekarang =
    new Date().toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  // ================================
  // UI
  // ================================

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          #surat-print,
          #surat-print * {
            visibility: visible !important;
          }

          #surat-print {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <main className="min-h-screen bg-slate-100 text-slate-900">

        {/* HEADER */}

        <header className="no-print border-b bg-white">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

            <a
              href="/"
              className="text-2xl font-black"
            >
              Urusin
              <span className="text-blue-600">
                .
              </span>
            </a>

            <a
              href="/cv"
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
            >
              ← Kembali ke CV
            </a>

          </div>

        </header>


        {/* HERO */}

        <section className="no-print mx-auto max-w-7xl px-5 pb-7 pt-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
                💌 Urusin Tools
              </div>

              <h1 className="text-3xl font-black md:text-4xl">
                Surat Lamaran Kerja
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Buat surat lamaran profesional
                dari data CV kamu dalam
                beberapa detik.
              </p>

            </div>

            <button
              onClick={generateSurat}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading
                ? "✨ Membuat..."
                : "✨ Buat Surat Otomatis"}
            </button>

          </div>

        </section>


        {/* CONTENT */}

        <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 lg:grid-cols-[400px_1fr]">

          {/* LEFT */}

          <div className="no-print space-y-5">

            {/* DATA CV */}

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                  📄
                </div>

                <div>

                  <h2 className="font-bold">
                    Data CV Terhubung
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Data pribadi, pendidikan,
                    dan pengalaman digunakan
                    sebagai bahan surat.
                  </p>

                  <a
                    href="/cv"
                    className="mt-2 inline-block text-sm font-bold text-blue-600 hover:underline"
                  >
                    Edit CV →
                  </a>

                </div>

              </div>

            </div>


            {/* TUJUAN */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <h2 className="mb-5 text-lg font-black">
                🎯 Tujuan Lamaran
              </h2>

              <div className="space-y-5">

                <Input
                  label="Posisi yang dilamar"
                  placeholder="Contoh: Staff Administrasi"
                  value={posisi}
                  onChange={setPosisi}
                />

                <Input
                  label="Nama perusahaan"
                  placeholder="Contoh: PT Maju Jaya"
                  value={perusahaan}
                  onChange={setPerusahaan}
                />

                <div>

                  <label className="mb-2 block text-sm font-bold">
                    Alamat perusahaan
                  </label>

                  <textarea
                    rows={3}
                    value={alamatPerusahaan}
                    onChange={(e) =>
                      setAlamatPerusahaan(
                        e.target.value
                      )
                    }
                    placeholder="Contoh: Jl. Ahmad Yani No. 10, Makassar"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

            </div>


            {/* STYLE */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <h2 className="mb-2 text-lg font-black">
                🎨 Gaya Surat
              </h2>

              <p className="mb-4 text-sm text-slate-500">
                Pilih gaya yang paling sesuai
                dengan kondisi kamu.
              </p>

              <div className="space-y-3">

                <StyleButton
                  active={
                    style === "formal"
                  }
                  title="Formal"
                  description="Cocok untuk perusahaan formal dan instansi."
                  onClick={() =>
                    setStyle("formal")
                  }
                />

                <StyleButton
                  active={
                    style ===
                    "professional"
                  }
                  title="Profesional"
                  description="Pilihan aman untuk sebagian besar pekerjaan."
                  onClick={() =>
                    setStyle(
                      "professional"
                    )
                  }
                />

                <StyleButton
                  active={
                    style === "fresh"
                  }
                  title="Fresh Graduate"
                  description="Cocok untuk pelamar dengan pengalaman terbatas."
                  onClick={() =>
                    setStyle("fresh")
                  }
                />

              </div>

            </div>


            {/* DATA PEMOHON */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <h2 className="mb-3 text-lg font-black">
                👤 Data Pemohon
              </h2>

              <InfoRow
                label="Nama"
                value={nama}
              />

              <InfoRow
                label="Email"
                value={email}
              />

              <InfoRow
                label="Telepon"
                value={telepon}
              />

              <InfoRow
                label="Kota"
                value={lokasi}
              />

            </div>


            {/* RESET */}

            <button
              onClick={resetSurat}
              className="w-full rounded-xl border border-red-200 bg-white py-3 text-sm font-bold text-red-500 hover:bg-red-50"
            >
              🗑️ Hapus Surat
            </button>

          </div>


          {/* RIGHT */}

          <section>

            {/* TOOLBAR */}

            <div className="no-print mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-xl font-black">
                  Preview Surat
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  A4 • Profesional • Siap dicetak

                  {saved && (
                    <span className="ml-2 text-green-600">
                      ✓ Tersimpan
                    </span>
                  )}
                </p>

              </div>


              {surat && (

                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={() =>
                      setEditMode(
                        !editMode
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold shadow-sm hover:bg-slate-50"
                  >
                    {editMode
                      ? "👁️ Preview"
                      : "✏️ Edit"}
                  </button>

                  <button
                    onClick={copySurat}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold shadow-sm hover:bg-slate-50"
                  >
                    📋 Salin
                  </button>

                  <button
                    onClick={printPDF}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
                  >
                    📄 PDF
                  </button>

                </div>

              )}

            </div>


            {/* A4 */}

            <div
              id="surat-print"
              className="mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white shadow-2xl"
            >

              {/* EMPTY */}

              {!surat && (

                <div className="flex min-h-[297mm] items-center justify-center px-10 text-center">

                  <div>

                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
                      💌
                    </div>

                    <h3 className="text-xl font-black">
                      Surat lamaran belum dibuat
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Isi posisi dan nama
                      perusahaan, pilih gaya
                      surat, lalu klik{" "}
                      <b>
                        Buat Surat Otomatis
                      </b>
                      .
                    </p>

                  </div>

                </div>

              )}


              {/* PREVIEW */}

              {surat && !editMode && (

                <article className="px-[20mm] py-[18mm]">

                  {/* HEADER */}

                  <div className="mb-8 flex items-start justify-between border-b-2 border-slate-900 pb-5">

                    <div>

                      <h2 className="text-xl font-black">
                        {nama}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        {email || ""}
                        {email &&
                          telepon &&
                          " • "}
                        {telepon || ""}
                      </p>

                      {lokasi && (
                        <p className="mt-1 text-xs text-slate-500">
                          {lokasi}
                        </p>
                      )}

                    </div>

                    <div className="text-right">

                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Surat Lamaran
                      </div>

                      <div className="mt-1 text-xs font-semibold text-slate-700">
                        {posisi}
                      </div>

                    </div>

                  </div>


                  {/* TANGGAL */}

                  <div className="mb-7 text-right text-[13px]">
                    {lokasi || "Kota"},{" "}
                    {tanggalSekarang}
                  </div>


                  {/* TUJUAN */}

                  <div className="mb-6 text-[13px] leading-6">

                    <div className="font-semibold">
                      Yth. Bapak/Ibu HRD
                    </div>

                    <div className="font-semibold">
                      {perusahaan}
                    </div>

                    <div>
                      {alamatPerusahaan ||
                        "Di tempat"}
                    </div>

                  </div>


                  {/* PERIHAL */}

                  <div className="mb-7 text-[13px]">

                    <span className="font-bold">
                      Perihal:
                    </span>{" "}

                    Lamaran Pekerjaan sebagai{" "}

                    <span className="font-semibold">
                      {posisi}
                    </span>

                  </div>


                  {/* ISI */}

                  <div className="space-y-4 text-justify text-[13px] leading-7">

                    {getIsiSurat()
                      .split("\n\n")
                      .map(
                        (
                          paragraph,
                          index
                        ) => (
                          <p
                            key={index}
                            className={
                              paragraph.startsWith(
                                "Nama"
                              )
                                ? "whitespace-pre-line"
                                : ""
                            }
                          >
                            {paragraph}
                          </p>
                        )
                      )}

                  </div>


                  {/* SIGNATURE */}

                  <div className="mt-12 text-[13px]">

                    <p>
                      Hormat saya,
                    </p>

                    <div className="h-16" />

                    <p className="font-bold underline">
                      {nama}
                    </p>

                  </div>

                </article>

              )}


              {/* EDIT */}

              {surat && editMode && (

                <div className="p-[15mm]">

                  <div className="mb-5">

                    <h2 className="text-xl font-black">
                      ✏️ Edit Surat
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Ubah isi surat sesuai
                      kebutuhanmu.
                    </p>

                  </div>

                  <textarea
                    value={surat}
                    onChange={(e) =>
                      setSurat(
                        e.target.value
                      )
                    }
                    className="min-h-[850px] w-full resize-none rounded-xl border border-slate-200 p-5 text-sm leading-7 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              )}

            </div>

          </section>

        </div>

      </main>
    </>
  );
}


// ========================================
// INPUT
// ========================================

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />

    </div>
  );
}


// ========================================
// STYLE BUTTON
// ========================================

function StyleButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition ${
        active
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >

      <div className="flex items-center justify-between">

        <span className="font-bold">
          {title}
        </span>

        {active && (
          <span className="text-blue-600">
            ✓
          </span>
        )}

      </div>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </button>
  );
}


// ========================================
// INFO ROW
// ========================================

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 border-b border-slate-100 py-3 text-sm">

      <span className="w-20 shrink-0 font-semibold text-slate-500">
        {label}
      </span>

      <span className="break-all font-medium">
        {value || "-"}
      </span>

    </div>
  );
}