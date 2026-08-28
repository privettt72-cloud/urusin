
"use client";

import { useEffect, useState } from "react";

type StyleType = "formal" | "professional" | "simple";

type CVData = {
  nama?: string;
  email?: string;
  telepon?: string;
  kota?: string;
  lokasi?: string;
};

const STORAGE_KEY = "urusin-surat-resign";

export default function SuratResignPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [kota, setKota] = useState("");

  const [perusahaan, setPerusahaan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [tanggalResign, setTanggalResign] =
    useState("");

  const [alasan, setAlasan] = useState("");

  const [style, setStyle] =
    useState<StyleType>("professional");

  const [surat, setSurat] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  // ========================================
  // LOAD DATA CV
  // ========================================

  useEffect(() => {
    try {
      const dataCV =
        localStorage.getItem("urusin-cv");

      if (!dataCV) return;

      const data: CVData =
        JSON.parse(dataCV);

      setNama(data.nama || "");
      setEmail(data.email || "");
      setTelepon(data.telepon || "");
      setKota(
        data.kota ||
          data.lokasi ||
          ""
      );
    } catch (error) {
      console.error(
        "Gagal membaca data CV:",
        error
      );
    }
  }, []);

  // ========================================
  // LOAD SURAT TERSIMPAN
  // ========================================

  useEffect(() => {
    try {
      const savedData =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!savedData) return;

      const data = JSON.parse(savedData);

      setPerusahaan(
        data.perusahaan || ""
      );

      setJabatan(
        data.jabatan || ""
      );

      setTanggalResign(
        data.tanggalResign || ""
      );

      setAlasan(
        data.alasan || ""
      );

      setStyle(
        data.style || "professional"
      );

      setSurat(
        data.surat || ""
      );
    } catch (error) {
      console.error(
        "Gagal membaca surat:",
        error
      );
    }
  }, []);

  // ========================================
  // AUTO SAVE
  // ========================================

  useEffect(() => {
    if (
      !perusahaan &&
      !jabatan &&
      !surat
    ) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          perusahaan,
          jabatan,
          tanggalResign,
          alasan,
          style,
          surat,
        })
      );

      setSaved(true);

      const timer = setTimeout(() => {
        setSaved(false);
      }, 1500);

      return () =>
        clearTimeout(timer);
    } catch (error) {
      console.error(
        "Gagal menyimpan data:",
        error
      );
    }
  }, [
    perusahaan,
    jabatan,
    tanggalResign,
    alasan,
    style,
    surat,
  ]);

  // ========================================
  // FORMAT TANGGAL
  // ========================================

  function formatTanggal(
    value: string
  ) {
    if (!value) {
      return new Date().toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
    }

    const date = new Date(
      `${value}T00:00:00`
    );

    return date.toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  // ========================================
  // GENERATOR SURAT
  // ========================================

  function generateSurat() {
    if (!nama.trim()) {
      alert(
        "Nama belum tersedia. Isi CV terlebih dahulu."
      );
      return;
    }

    if (!perusahaan.trim()) {
      alert(
        "Masukkan nama perusahaan."
      );
      return;
    }

    if (!jabatan.trim()) {
      alert(
        "Masukkan jabatan kamu."
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const tanggal =
        formatTanggal(
          tanggalResign
        );

      let paragrafAlasan =
        "Saya telah mempertimbangkan keputusan ini dengan matang dan merasa bahwa pengunduran diri merupakan langkah yang tepat bagi perkembangan saya ke depannya.";

      if (alasan.trim()) {
        paragrafAlasan =
          `Adapun alasan pengunduran diri saya adalah ${alasan.trim()}.`;
      }

      let isi = "";

      // ====================================
      // FORMAL
      // ====================================

      if (style === "formal") {
        isi = [
          `Dengan hormat, melalui surat ini saya ${nama} bermaksud menyampaikan pengunduran diri dari posisi ${jabatan} di ${perusahaan}, terhitung mulai tanggal ${tanggal}.`,
          paragrafAlasan,
          "Keputusan ini telah saya pertimbangkan dengan baik. Saya mengucapkan terima kasih atas kesempatan, kepercayaan, pengalaman, serta pembelajaran yang telah saya peroleh selama bekerja di perusahaan.",
          "Saya juga memohon maaf apabila selama menjalankan tugas terdapat kesalahan maupun kekurangan. Saya bersedia membantu proses serah terima pekerjaan agar dapat berjalan dengan baik.",
          "Demikian surat pengunduran diri ini saya sampaikan. Saya berharap hubungan baik yang telah terjalin dapat tetap terjaga.",
        ].join("\n\n");
      }

      // ====================================
      // PROFESSIONAL
      // ====================================

      if (style === "professional") {
        isi = [
          `Dengan surat ini saya ${nama} bermaksud mengajukan pengunduran diri dari posisi ${jabatan} di ${perusahaan}, efektif mulai tanggal ${tanggal}.`,
          paragrafAlasan,
          "Saya sangat menghargai kesempatan yang telah diberikan kepada saya untuk menjadi bagian dari perusahaan. Selama bekerja, saya memperoleh banyak pengalaman dan pembelajaran yang sangat berarti bagi perkembangan profesional saya.",
          "Saya mengucapkan terima kasih kepada seluruh pihak yang telah memberikan dukungan dan kerja sama selama saya bekerja. Saya juga siap membantu proses transisi dan serah terima pekerjaan agar berjalan dengan lancar.",
          "Saya berharap ${perusahaan} terus berkembang dan sukses di masa mendatang.",
        ].join("\n\n");
      }

      // ====================================
      // SEDERHANA
      // ====================================

      if (style === "simple") {
        isi = [
          `Saya ${nama} bermaksud menyampaikan pengunduran diri dari posisi ${jabatan} di ${perusahaan}, efektif mulai tanggal ${tanggal}.`,
          paragrafAlasan,
          "Terima kasih atas kesempatan dan pengalaman yang telah diberikan selama saya bekerja di perusahaan.",
          "Saya siap membantu proses serah terima pekerjaan sebelum tanggal pengunduran diri saya.",
          "Mohon maaf atas segala kesalahan dan kekurangan selama saya bekerja. Semoga perusahaan semakin maju dan sukses.",
        ].join("\n\n");
      }

      const hasil = [
        `${kota || "Kota"}, ${formatTanggal(
          new Date()
            .toISOString()
            .split("T")[0]
        )}`,
        "",
        "Yth. Bapak/Ibu HRD",
        perusahaan,
        "Di tempat",
        "",
        `Perihal: Pengunduran Diri`,
        "",
        isi,
        "",
        "Demikian surat pengunduran diri ini saya buat dengan sebenar-benarnya.",
        "",
        "Atas perhatian dan pengertiannya, saya ucapkan terima kasih.",
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

  // ========================================
  // SALIN
  // ========================================

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

  // ========================================
  // PRINT / PDF
  // ========================================

  function printPDF() {
    if (!surat) {
      alert(
        "Buat surat terlebih dahulu."
      );
      return;
    }

    window.print();
  }

  // ========================================
  // HAPUS
  // ========================================

  function resetSurat() {
    const yakin = confirm(
      "Yakin ingin menghapus surat resign ini?"
    );

    if (!yakin) return;

    setPerusahaan("");
    setJabatan("");
    setTanggalResign("");
    setAlasan("");
    setSurat("");
    setEditMode(false);

    localStorage.removeItem(
      STORAGE_KEY
    );
  }

  // ========================================
  // UI
  // ========================================

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

          #surat-resign-print,
          #surat-resign-print * {
            visibility: visible !important;
          }

          #surat-resign-print {
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
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
            >
              ← Kembali
            </a>

          </div>

        </header>


        {/* HERO */}

        <section className="no-print mx-auto max-w-7xl px-5 pb-7 pt-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <div className="mb-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-600">
                📝 Urusin Tools
              </div>

              <h1 className="text-3xl font-black md:text-4xl">
                Surat Resign
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Buat surat pengunduran diri
                yang rapi, profesional, dan
                siap dicetak.
              </p>

            </div>

            <button
              onClick={generateSurat}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
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
                    Nama dan data pribadi
                    diambil otomatis dari CV.
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


            {/* DATA RESIGN */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <h2 className="mb-5 text-lg font-black">
                🎯 Data Pengunduran Diri
              </h2>

              <div className="space-y-5">

                <Input
                  label="Nama perusahaan"
                  placeholder="Contoh: PT Maju Jaya"
                  value={perusahaan}
                  onChange={setPerusahaan}
                />

                <Input
                  label="Jabatan"
                  placeholder="Contoh: Staff Administrasi"
                  value={jabatan}
                  onChange={setJabatan}
                />

                <div>

                  <label className="mb-2 block text-sm font-bold">
                    Tanggal pengunduran diri
                  </label>

                  <input
                    type="date"
                    value={tanggalResign}
                    onChange={(e) =>
                      setTanggalResign(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-bold">
                    Alasan resign
                    <span className="ml-2 font-normal text-slate-400">
                      (opsional)
                    </span>
                  </label>

                  <textarea
                    rows={4}
                    value={alasan}
                    onChange={(e) =>
                      setAlasan(
                        e.target.value
                      )
                    }
                    placeholder="Contoh: ingin melanjutkan pendidikan"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
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
                Pilih gaya surat yang kamu
                inginkan.
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
                    style === "simple"
                  }
                  title="Sederhana"
                  description="Singkat, sopan, dan langsung ke inti."
                  onClick={() =>
                    setStyle("simple")
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
                value={kota}
              />

            </div>


            {/* HAPUS */}

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

                  A4 • Profesional • Siap
                  dicetak

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
                    className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-600"
                  >
                    📄 PDF
                  </button>

                </div>

              )}

            </div>


            {/* A4 */}

            <div
              id="surat-resign-print"
              className="mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white shadow-2xl"
            >

              {/* EMPTY */}

              {!surat && (

                <div className="flex min-h-[297mm] items-center justify-center px-10 text-center">

                  <div>

                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-4xl">
                      📝
                    </div>

                    <h3 className="text-xl font-black">
                      Surat resign belum dibuat
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Masukkan nama perusahaan,
                      jabatan, dan tanggal
                      pengunduran diri, kemudian
                      klik{" "}
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

                      {kota && (
                        <p className="mt-1 text-xs text-slate-500">
                          {kota}
                        </p>
                      )}

                    </div>

                    <div className="text-right">

                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Surat Resign
                      </div>

                      <div className="mt-1 text-xs font-semibold text-slate-700">
                        {jabatan}
                      </div>

                    </div>

                  </div>


                  {/* TANGGAL */}

                  <div className="mb-7 text-right text-[13px]">
                    {kota || "Kota"},{" "}
                    {formatTanggal(
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    )}
                  </div>


                  {/* TUJUAN */}

                  <div className="mb-7 text-[13px] leading-6">

                    <div className="font-semibold">
                      Yth. Bapak/Ibu HRD
                    </div>

                    <div className="font-semibold">
                      {perusahaan}
                    </div>

                    <div>
                      Di tempat
                    </div>

                  </div>


                  {/* PERIHAL */}

                  <div className="mb-7 text-[13px]">

                    <span className="font-bold">
                      Perihal:
                    </span>{" "}

                    Pengunduran Diri

                  </div>


                  {/* ISI */}

                  <div className="space-y-4 text-justify text-[13px] leading-7">

                    {surat
                      .split("\n\n")
                      .slice(6, -3)
                      .map(
                        (
                          paragraph,
                          index
                        ) => (
                          <p
                            key={index}
                            className="whitespace-pre-line"
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
                      Kamu bisa mengubah isi
                      surat secara manual.
                    </p>

                  </div>

                  <textarea
                    value={surat}
                    onChange={(e) =>
                      setSurat(
                        e.target.value
                      )
                    }
                    className="min-h-[850px] w-full resize-none rounded-xl border border-slate-200 p-5 text-sm leading-7 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
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
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
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
          ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >

      <div className="flex items-center justify-between">

        <span className="font-bold">
          {title}
        </span>

        {active && (
          <span className="text-orange-600">
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

