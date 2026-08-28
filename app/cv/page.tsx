
"use client";

import { ChangeEvent, useEffect, useState } from "react";

type Education = {
  id: number;
  school: string;
  major: string;
  year: string;
  description: string;
};

type Experience = {
  id: number;
  company: string;
  position: string;
  year: string;
  description: string;
};

type Template = "classic" | "modern" | "minimal";

type CVProps = {
  nama: string;
  email: string;
  telepon: string;
  lokasi: string;
  foto: string;
  tentang: string;
  pendidikan: Education[];
  pengalaman: Experience[];
  keahlian: string;
};

export default function CVPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tentang, setTentang] = useState("");
  const [keahlian, setKeahlian] = useState("");

  const [foto, setFoto] = useState("");

  const [template, setTemplate] =
    useState<Template>("classic");

  const [pendidikan, setPendidikan] = useState<Education[]>([
    {
      id: 1,
      school: "",
      major: "",
      year: "",
      description: "",
    },
  ]);

  const [pengalaman, setPengalaman] = useState<Experience[]>([
    {
      id: 1,
      company: "",
      position: "",
      year: "",
      description: "",
    },
  ]);

  const [aiLoading, setAiLoading] = useState(false);

  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {
    try {
      const saved = localStorage.getItem("urusin-cv");

      if (!saved) return;

      const data = JSON.parse(saved);

      setNama(data.nama || "");
      setEmail(data.email || "");
      setTelepon(data.telepon || "");
      setLokasi(data.lokasi || "");
      setTentang(data.tentang || "");
      setKeahlian(data.keahlian || "");
      setFoto(data.foto || "");
      setTemplate(data.template || "classic");

      if (
        Array.isArray(data.pendidikan) &&
        data.pendidikan.length
      ) {
        setPendidikan(data.pendidikan);
      }

      if (
        Array.isArray(data.pengalaman) &&
        data.pengalaman.length
      ) {
        setPengalaman(data.pengalaman);
      }
    } catch {
      console.log("Data CV tidak dapat dimuat.");
    }
  }, []);

  // ==============================
  // AUTO SAVE
  // ==============================

  useEffect(() => {
    const data = {
      nama,
      email,
      telepon,
      lokasi,
      tentang,
      keahlian,
      foto,
      template,
      pendidikan,
      pengalaman,
    };

    localStorage.setItem(
      "urusin-cv",
      JSON.stringify(data)
    );
  }, [
    nama,
    email,
    telepon,
    lokasi,
    tentang,
    keahlian,
    foto,
    template,
    pendidikan,
    pengalaman,
  ]);

  // ==============================
  // FOTO
  // ==============================

  function uploadFoto(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Pilih file gambar.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFoto(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  // ==============================
  // PENDIDIKAN
  // ==============================

  function tambahPendidikan() {
    setPendidikan((items) => [
      ...items,
      {
        id: Date.now(),
        school: "",
        major: "",
        year: "",
        description: "",
      },
    ]);
  }

  function hapusPendidikan(id: number) {
    setPendidikan((items) =>
      items.filter((item) => item.id !== id)
    );
  }

  function updatePendidikan(
    id: number,
    field: keyof Education,
    value: string
  ) {
    setPendidikan((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  // ==============================
  // PENGALAMAN
  // ==============================

  function tambahPengalaman() {
    setPengalaman((items) => [
      ...items,
      {
        id: Date.now(),
        company: "",
        position: "",
        year: "",
        description: "",
      },
    ]);
  }

  function hapusPengalaman(id: number) {
    setPengalaman((items) =>
      items.filter((item) => item.id !== id)
    );
  }

  function updatePengalaman(
    id: number,
    field: keyof Experience,
    value: string
  ) {
    setPengalaman((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  // ==============================
  // GENERATOR "AI"
  // ==============================

  function generateProfile() {
    const posisi =
      pengalaman.find((item) => item.position)?.position ||
      "";

    const skillList = keahlian
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const skillText =
      skillList.length > 0
        ? skillList.slice(0, 4).join(", ")
        : "komunikasi, kerja sama tim, dan pemecahan masalah";

    const pendidikanUtama =
      pendidikan.find((item) => item.school)?.major || "";

    let hasil = "";

    if (posisi) {
      hasil = `${posisi} yang memiliki kemampuan dalam ${skillText}. Memiliki semangat belajar, mampu bekerja secara mandiri maupun dalam tim, serta berkomitmen memberikan hasil kerja yang baik dan profesional.`;
    } else if (pendidikanUtama) {
      hasil = `Lulusan ${pendidikanUtama} yang memiliki kemampuan dalam ${skillText}. Memiliki semangat belajar yang tinggi, mampu beradaptasi dengan lingkungan baru, dan siap mengembangkan kemampuan secara profesional.`;
    } else {
      hasil = `Individu yang memiliki kemampuan dalam ${skillText}. Memiliki motivasi belajar yang tinggi, bertanggung jawab, mampu bekerja sama dalam tim, dan siap berkembang secara profesional.`;
    }

    setTentang(hasil);
  }

  function generateExperience(id: number) {
    const item = pengalaman.find(
      (experience) => experience.id === id
    );

    if (!item) return;

    const posisi =
      item.position || "profesional";

    const perusahaan =
      item.company || "perusahaan";

    let hasil = "";

    const lower = posisi.toLowerCase();

    if (
      lower.includes("kasir") ||
      lower.includes("cashier")
    ) {
      hasil = `Bertanggung jawab menangani transaksi pelanggan, mengelola pembayaran, memastikan ketelitian pencatatan transaksi, serta memberikan pelayanan yang ramah dan profesional di ${perusahaan}.`;
    } else if (
      lower.includes("admin") ||
      lower.includes("administrasi")
    ) {
      hasil = `Bertanggung jawab melakukan administrasi dan pengelolaan dokumen, memasukkan serta memperbarui data, membantu kebutuhan operasional, dan memastikan pekerjaan administrasi terselesaikan secara rapi dan tepat waktu di ${perusahaan}.`;
    } else if (
      lower.includes("marketing") ||
      lower.includes("sales")
    ) {
      hasil = `Bertanggung jawab melakukan kegiatan pemasaran dan penjualan, berkomunikasi dengan pelanggan, memperkenalkan produk atau layanan, serta membantu mencapai target perusahaan di ${perusahaan}.`;
    } else if (
      lower.includes("developer") ||
      lower.includes("programmer") ||
      lower.includes("software")
    ) {
      hasil = `Mengembangkan dan memelihara aplikasi serta fitur sesuai kebutuhan perusahaan, melakukan pemecahan masalah teknis, melakukan pengujian, dan berkolaborasi dengan tim untuk menghasilkan solusi digital yang efektif di ${perusahaan}.`;
    } else if (
      lower.includes("desain") ||
      lower.includes("designer")
    ) {
      hasil = `Membuat dan mengembangkan materi desain sesuai kebutuhan perusahaan, menerapkan prinsip visual yang konsisten, serta bekerja sama dengan tim untuk menghasilkan materi yang menarik dan efektif di ${perusahaan}.`;
    } else {
      hasil = `Bertanggung jawab menjalankan tugas sebagai ${posisi}, menyelesaikan pekerjaan sesuai target, menjaga kualitas hasil kerja, serta berkoordinasi dengan tim untuk mendukung kegiatan operasional ${perusahaan}.`;
    }

    updatePengalaman(
      id,
      "description",
      hasil
    );
  }

  function generateEducation(id: number) {
    const item = pendidikan.find(
      (education) => education.id === id
    );

    if (!item) return;

    const jurusan =
      item.major || "bidang studi terkait";

    const hasil = `Mempelajari ${jurusan} dan mengembangkan kemampuan akademik maupun praktis melalui kegiatan pembelajaran, tugas, proyek, dan kerja sama tim.`;

    updatePendidikan(
      id,
      "description",
      hasil
    );
  }

  function generateSkills() {
    const posisi =
      pengalaman.find((item) => item.position)?.position ||
      "";

    const lower = posisi.toLowerCase();

    let skills = [
      "Komunikasi",
      "Kerja Sama Tim",
      "Problem Solving",
      "Manajemen Waktu",
    ];

    if (
      lower.includes("developer") ||
      lower.includes("programmer") ||
      lower.includes("software")
    ) {
      skills = [
        "JavaScript",
        "HTML & CSS",
        "Git",
        "Problem Solving",
        "Teamwork",
      ];
    }

    if (
      lower.includes("admin") ||
      lower.includes("administrasi")
    ) {
      skills = [
        "Microsoft Office",
        "Administrasi Data",
        "Pengarsipan",
        "Komunikasi",
        "Manajemen Waktu",
      ];
    }

    if (
      lower.includes("marketing") ||
      lower.includes("sales")
    ) {
      skills = [
        "Komunikasi",
        "Negosiasi",
        "Customer Service",
        "Marketing",
        "Teamwork",
      ];
    }

    if (
      lower.includes("kasir") ||
      lower.includes("cashier")
    ) {
      skills = [
        "Pelayanan Pelanggan",
        "Pengelolaan Kas",
        "Ketelitian",
        "Komunikasi",
        "Teamwork",
      ];
    }

    setKeahlian(skills.join(", "));
  }

  function bantuIsiSemua() {
    setAiLoading(true);

    setTimeout(() => {
      generateProfile();
      generateSkills();

      pengalaman.forEach((item) => {
        if (
          item.company ||
          item.position
        ) {
          generateExperience(item.id);
        }
      });

      pendidikan.forEach((item) => {
        if (
          item.school ||
          item.major
        ) {
          generateEducation(item.id);
        }
      });

      setAiLoading(false);
    }, 700);
  }

  // ==============================
  // RESET
  // ==============================

  function resetCV() {
    const confirmReset = window.confirm(
      "Yakin ingin menghapus semua data CV?"
    );

    if (!confirmReset) return;

    localStorage.removeItem("urusin-cv");

    setNama("");
    setEmail("");
    setTelepon("");
    setLokasi("");
    setTentang("");
    setKeahlian("");
    setFoto("");
    setTemplate("classic");

    setPendidikan([
      {
        id: Date.now(),
        school: "",
        major: "",
        year: "",
        description: "",
      },
    ]);

    setPengalaman([
      {
        id: Date.now() + 1,
        company: "",
        position: "",
        year: "",
        description: "",
      },
    ]);
  }

  // ==============================
  // PRINT / PDF
  // ==============================

  function downloadPDF() {
    window.print();
  }

  return (
    <>
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html,
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          body * {
            visibility: hidden;
          }

          #cv-print,
          #cv-print * {
            visibility: visible;
          }

          #cv-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }

          .cv-page {
            box-shadow: none !important;
            margin: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
          }
        }
      `}</style>

      <main className="min-h-screen bg-slate-100 text-slate-900">

        {/* HEADER */}

        <header className="no-print border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

            <a
              href="/"
              className="text-2xl font-bold"
            >
              Urusin<span className="text-blue-600">.</span>
            </a>

            <a
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              ← Kembali
            </a>

          </div>
        </header>


        {/* TITLE */}

        <div className="no-print mx-auto max-w-7xl px-5 pb-5 pt-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <h1 className="text-3xl font-bold md:text-4xl">
                Buat CV ATS
              </h1>

              <p className="mt-2 text-slate-600">
                Buat CV profesional dengan bantuan otomatis.
              </p>

            </div>

            <button
              type="button"
              onClick={bantuIsiSemua}
              disabled={aiLoading}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {aiLoading
                ? "✨ Sedang membuat..."
                : "✨ Bantu Isi CV"}
            </button>

          </div>

        </div>


        {/* CONTENT */}

        <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 lg:grid-cols-[460px_1fr]">

          {/* FORM */}

          <div className="no-print space-y-5">

            <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-blue-50 p-5">

              <div className="flex gap-3">

                <div className="text-2xl">
                  ✨
                </div>

                <div>

                  <h2 className="font-bold">
                    Bantu Isi CV
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Isi nama posisi dan pengalaman terlebih dahulu.
                    Urusin akan membantu membuat profil, deskripsi
                    pengalaman, pendidikan, dan keahlian.
                  </p>

                  <button
                    type="button"
                    onClick={bantuIsiSemua}
                    disabled={aiLoading}
                    className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-bold text-violet-600 shadow-sm ring-1 ring-violet-200 hover:bg-violet-50 disabled:opacity-60"
                  >
                    {aiLoading
                      ? "Memproses..."
                      : "✨ Bantu Isi Sekarang"}
                  </button>

                </div>

              </div>

            </div>


            <FormCard title="👤 Data Diri">

              <Input
                label="Nama lengkap"
                placeholder="Ahmad Fauzan"
                value={nama}
                onChange={setNama}
              />

              <Input
                label="Email"
                placeholder="ahmad@email.com"
                value={email}
                onChange={setEmail}
                type="email"
              />

              <Input
                label="Nomor telepon"
                placeholder="08123456789"
                value={telepon}
                onChange={setTelepon}
              />

              <Input
                label="Kota"
                placeholder="Makassar"
                value={lokasi}
                onChange={setLokasi}
              />

              <TextArea
                label="Tentang saya"
                placeholder="Atau klik ✨ Bantu Isi CV"
                value={tentang}
                onChange={setTentang}
              />

              <button
                type="button"
                onClick={generateProfile}
                className="w-full rounded-xl border border-violet-200 bg-violet-50 py-3 text-sm font-bold text-violet-600 hover:bg-violet-100"
              >
                ✨ Bantu Buat Profil
              </button>

            </FormCard>


            <FormCard title="📷 Foto Profil">

              <div className="flex items-center gap-4">

                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-slate-100">

                  {foto ? (
                    <img
                      src={foto}
                      alt="Foto profil"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">
                      👤
                    </span>
                  )}

                </div>

                <div>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={uploadFoto}
                    className="block w-full text-sm"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    JPG atau PNG, maksimal 2 MB.
                  </p>

                </div>

              </div>

            </FormCard>


            <FormCard title="🎓 Pendidikan">

              <div className="space-y-4">

                {pendidikan.map((item, index) => (

                  <div
                    key={item.id}
                    className="rounded-xl border bg-slate-50 p-4"
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <strong className="text-sm">
                        Pendidikan {index + 1}
                      </strong>

                      {pendidikan.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            hapusPendidikan(item.id)
                          }
                          className="text-xs font-semibold text-red-500"
                        >
                          Hapus
                        </button>
                      )}

                    </div>

                    <div className="space-y-4">

                      <Input
                        label="Sekolah / Universitas"
                        placeholder="Universitas Hasanuddin"
                        value={item.school}
                        onChange={(value) =>
                          updatePendidikan(
                            item.id,
                            "school",
                            value
                          )
                        }
                      />

                      <Input
                        label="Jurusan"
                        placeholder="Teknik Informatika"
                        value={item.major}
                        onChange={(value) =>
                          updatePendidikan(
                            item.id,
                            "major",
                            value
                          )
                        }
                      />

                      <Input
                        label="Tahun"
                        placeholder="2022 - 2026"
                        value={item.year}
                        onChange={(value) =>
                          updatePendidikan(
                            item.id,
                            "year",
                            value
                          )
                        }
                      />

                      <TextArea
                        label="Deskripsi"
                        placeholder="Deskripsi pendidikan..."
                        value={item.description}
                        onChange={(value) =>
                          updatePendidikan(
                            item.id,
                            "description",
                            value
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          generateEducation(item.id)
                        }
                        className="w-full rounded-xl border border-violet-200 bg-violet-50 py-2.5 text-sm font-bold text-violet-600 hover:bg-violet-100"
                      >
                        ✨ Bantu Buat Deskripsi
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              <button
                type="button"
                onClick={tambahPendidikan}
                className="mt-4 w-full rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-100"
              >
                + Tambah Pendidikan
              </button>

            </FormCard>


            <FormCard title="💼 Pengalaman Kerja">

              <div className="space-y-4">

                {pengalaman.map((item, index) => (

                  <div
                    key={item.id}
                    className="rounded-xl border bg-slate-50 p-4"
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <strong className="text-sm">
                        Pengalaman {index + 1}
                      </strong>

                      {pengalaman.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            hapusPengalaman(item.id)
                          }
                          className="text-xs font-semibold text-red-500"
                        >
                          Hapus
                        </button>
                      )}

                    </div>

                    <div className="space-y-4">

                      <Input
                        label="Nama perusahaan"
                        placeholder="PT Contoh Indonesia"
                        value={item.company}
                        onChange={(value) =>
                          updatePengalaman(
                            item.id,
                            "company",
                            value
                          )
                        }
                      />

                      <Input
                        label="Posisi"
                        placeholder="Frontend Developer"
                        value={item.position}
                        onChange={(value) =>
                          updatePengalaman(
                            item.id,
                            "position",
                            value
                          )
                        }
                      />

                      <Input
                        label="Periode"
                        placeholder="2024 - 2026"
                        value={item.year}
                        onChange={(value) =>
                          updatePengalaman(
                            item.id,
                            "year",
                            value
                          )
                        }
                      />

                      <TextArea
                        label="Deskripsi pekerjaan"
                        placeholder="Tulis pekerjaanmu atau gunakan bantuan otomatis..."
                        value={item.description}
                        onChange={(value) =>
                          updatePengalaman(
                            item.id,
                            "description",
                            value
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          generateExperience(item.id)
                        }
                        className="w-full rounded-xl border border-violet-200 bg-violet-50 py-2.5 text-sm font-bold text-violet-600 hover:bg-violet-100"
                      >
                        ✨ Bantu Buat Deskripsi
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              <button
                type="button"
                onClick={tambahPengalaman}
                className="mt-4 w-full rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-100"
              >
                + Tambah Pengalaman
              </button>

            </FormCard>


            <FormCard title="🛠️ Keahlian">

              <TextArea
                label="Keahlian"
                placeholder="JavaScript, React, Figma, Microsoft Office"
                value={keahlian}
                onChange={setKeahlian}
              />

              <p className="text-xs text-slate-500">
                Pisahkan dengan koma.
              </p>

              <button
                type="button"
                onClick={generateSkills}
                className="w-full rounded-xl border border-violet-200 bg-violet-50 py-3 text-sm font-bold text-violet-600 hover:bg-violet-100"
              >
                ✨ Rekomendasikan Keahlian
              </button>

            </FormCard>


            <FormCard title="🎨 Template">

              <div className="grid grid-cols-3 gap-2">

                <TemplateButton
                  name="Classic"
                  active={template === "classic"}
                  onClick={() =>
                    setTemplate("classic")
                  }
                />

                <TemplateButton
                  name="Modern"
                  active={template === "modern"}
                  onClick={() =>
                    setTemplate("modern")
                  }
                />

                <TemplateButton
                  name="Minimal"
                  active={template === "minimal"}
                  onClick={() =>
                    setTemplate("minimal")
                  }
                />

              </div>

            </FormCard>


            <button
              type="button"
              onClick={resetCV}
              className="w-full rounded-xl border border-red-200 bg-white py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              🗑️ Hapus Semua Data
            </button>

          </div>


          {/* PREVIEW */}

          <section>

            <div className="no-print sticky top-4 z-10 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Preview CV
                </h2>

                <p className="text-sm text-slate-500">
                  Ukuran A4 • Siap dicetak
                </p>
              </div>

              <button
                type="button"
                onClick={downloadPDF}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700"
              >
                📄 Download PDF
              </button>

            </div>


            <div
              id="cv-print"
              className="cv-page mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl"
            >

              {template === "classic" && (
                <ClassicCV
                  nama={nama}
                  email={email}
                  telepon={telepon}
                  lokasi={lokasi}
                  foto={foto}
                  tentang={tentang}
                  pendidikan={pendidikan}
                  pengalaman={pengalaman}
                  keahlian={keahlian}
                />
              )}

              {template === "modern" && (
                <ModernCV
                  nama={nama}
                  email={email}
                  telepon={telepon}
                  lokasi={lokasi}
                  foto={foto}
                  tentang={tentang}
                  pendidikan={pendidikan}
                  pengalaman={pengalaman}
                  keahlian={keahlian}
                />
              )}

              {template === "minimal" && (
                <MinimalCV
                  nama={nama}
                  email={email}
                  telepon={telepon}
                  lokasi={lokasi}
                  foto={foto}
                  tentang={tentang}
                  pendidikan={pendidikan}
                  pengalaman={pengalaman}
                  keahlian={keahlian}
                />
              )}

            </div>

          </section>

        </div>

      </main>
    </>
  );
}


/* ================================================= */
/* FORM CARD */
/* ================================================= */

function FormCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">

      <h2 className="mb-5 text-lg font-bold">
        {title}
      </h2>

      <div className="space-y-5">
        {children}
      </div>

    </div>
  );
}


/* ================================================= */
/* INPUT */
/* ================================================= */

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
}


/* ================================================= */
/* TEXTAREA */
/* ================================================= */

function TextArea({
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

      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
}


/* ================================================= */
/* TEMPLATE BUTTON */
/* ================================================= */

function TemplateButton({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
        active
          ? "border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-100"
          : "border-slate-200 bg-white hover:border-blue-300"
      }`}
    >
      {name}
    </button>
  );
}


/* ================================================= */
/* SECTION */
/* ================================================= */

function CVSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">

      <h2 className="mb-3 border-b border-slate-300 pb-2 text-[11px] font-bold uppercase tracking-[0.18em]">
        {title}
      </h2>

      {children}

    </section>
  );
}


/* ================================================= */
/* CLASSIC CV */
/* ================================================= */

function ClassicCV({
  nama,
  email,
  telepon,
  lokasi,
  foto,
  tentang,
  pendidikan,
  pengalaman,
  keahlian,
}: CVProps) {
  return (
    <div className="min-h-[297mm] px-[18mm] py-[16mm] text-[13px] leading-relaxed">

      <div className="flex items-start justify-between gap-8">

        <div className="min-w-0">

          <h1 className="break-words text-[30px] font-bold uppercase leading-tight">
            {nama || "NAMA LENGKAP"}
          </h1>

          <p className="mt-3 break-words text-[12px] text-slate-600">
            {[email, telepon, lokasi]
              .filter(Boolean)
              .join("  •  ") ||
              "email@email.com  •  08123456789  •  Kota"}
          </p>

        </div>

        {foto && (
          <img
            src={foto}
            alt="Foto profil"
            className="h-[30mm] w-[25mm] shrink-0 rounded-md object-cover"
          />
        )}

      </div>

      <div className="my-6 border-t-2 border-slate-900" />

      <CVSection title="Profil">

        <p className="whitespace-pre-line text-slate-700">
          {tentang ||
            "Tulis profil singkat tentang dirimu."}
        </p>

      </CVSection>

      <CVSection title="Pengalaman Kerja">

        {pengalaman
          .filter(
            (item) =>
              item.company ||
              item.position ||
              item.description
          )
          .map((item) => (

            <div
              key={item.id}
              className="mb-5"
            >

              <div className="flex justify-between gap-5">

                <div className="min-w-0">

                  <h3 className="font-bold">
                    {item.position ||
                      "Posisi"}
                  </h3>

                  <p className="font-medium text-slate-600">
                    {item.company ||
                      "Nama perusahaan"}
                  </p>

                </div>

                <span className="shrink-0 text-xs text-slate-500">
                  {item.year}
                </span>

              </div>

              {item.description && (
                <p className="mt-2 whitespace-pre-line text-slate-700">
                  {item.description}
                </p>
              )}

            </div>

          ))}

      </CVSection>

      <CVSection title="Pendidikan">

        {pendidikan
          .filter(
            (item) =>
              item.school ||
              item.major ||
              item.description
          )
          .map((item) => (

            <div
              key={item.id}
              className="mb-5"
            >

              <div className="flex justify-between gap-5">

                <div>

                  <h3 className="font-bold">
                    {item.school ||
                      "Nama sekolah"}
                  </h3>

                  <p className="text-slate-600">
                    {item.major}
                  </p>

                </div>

                <span className="shrink-0 text-xs text-slate-500">
                  {item.year}
                </span>

              </div>

              {item.description && (
                <p className="mt-2 whitespace-pre-line text-slate-700">
                  {item.description}
                </p>
              )}

            </div>

          ))}

      </CVSection>

      <CVSection title="Keahlian">

        <div className="flex flex-wrap gap-2">

          {(keahlian
            ? keahlian.split(",")
            : [
                "Microsoft Office",
                "Komunikasi",
                "Teamwork",
              ]
          )
            .filter((skill) => skill.trim())
            .map((skill) => (

              <span
                key={skill}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs"
              >
                {skill.trim()}
              </span>

            ))}

        </div>

      </CVSection>

    </div>
  );
}


/* ================================================= */
/* MODERN CV */
/* ================================================= */

function ModernCV({
  nama,
  email,
  telepon,
  lokasi,
  foto,
  tentang,
  pendidikan,
  pengalaman,
  keahlian,
}: CVProps) {
  return (
    <div className="min-h-[297mm] text-[13px]">

      <div className="bg-slate-900 px-[18mm] py-[14mm] text-white">

        <div className="flex items-center gap-6">

          {foto && (
            <img
              src={foto}
              alt="Foto profil"
              className="h-[30mm] w-[30mm] shrink-0 rounded-full object-cover ring-4 ring-white/20"
            />
          )}

          <div className="min-w-0">

            <h1 className="break-words text-[30px] font-bold leading-tight">
              {nama || "Nama Lengkap"}
            </h1>

            <p className="mt-3 break-words text-[12px] text-slate-300">
              {[email, telepon, lokasi]
                .filter(Boolean)
                .join("  •  ") ||
                "email@email.com  •  08123456789  •  Kota"}
            </p>

          </div>

        </div>

      </div>

      <div className="px-[18mm] py-[14mm]">

        <CVSection title="Profil">

          <p className="whitespace-pre-line text-slate-700">
            {tentang ||
              "Tulis profil profesionalmu."}
          </p>

        </CVSection>

        <CVSection title="Pengalaman">

          {pengalaman
            .filter(
              (item) =>
                item.company ||
                item.position ||
                item.description
            )
            .map((item) => (

              <div
                key={item.id}
                className="mb-6 border-l-2 border-slate-900 pl-4"
              >

                <div className="flex justify-between gap-5">

                  <div>

                    <h3 className="font-bold">
                      {item.position ||
                        "Posisi"}
                    </h3>

                    <p className="text-slate-600">
                      {item.company}
                    </p>

                  </div>

                  <span className="shrink-0 text-xs text-slate-500">
                    {item.year}
                  </span>

                </div>

                <p className="mt-2 whitespace-pre-line text-slate-700">
                  {item.description}
                </p>

              </div>

            ))}

        </CVSection>

        <CVSection title="Pendidikan">

          {pendidikan
            .filter(
              (item) =>
                item.school ||
                item.major ||
                item.description
            )
            .map((item) => (

              <div
                key={item.id}
                className="mb-5"
              >

                <div className="flex justify-between gap-5">

                  <div>

                    <h3 className="font-bold">
                      {item.school}
                    </h3>

                    <p className="text-slate-600">
                      {item.major}
                    </p>

                  </div>

                  <span className="shrink-0 text-xs text-slate-500">
                    {item.year}
                  </span>

                </div>

                <p className="mt-2 whitespace-pre-line text-slate-700">
                  {item.description}
                </p>

              </div>

            ))}

        </CVSection>

        <CVSection title="Keahlian">

          <div className="grid grid-cols-2 gap-2">

            {(keahlian
              ? keahlian.split(",")
              : [
                  "Microsoft Office",
                  "Komunikasi",
                  "Teamwork",
                  "Problem Solving",
                ]
            )
              .filter((skill) => skill.trim())
              .map((skill) => (

                <div
                  key={skill}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs"
                >
                  {skill.trim()}
                </div>

              ))}

          </div>

        </CVSection>

      </div>

    </div>
  );
}


/* ================================================= */
/* MINIMAL CV */
/* ================================================= */

function MinimalCV({
  nama,
  email,
  telepon,
  lokasi,
  foto,
  tentang,
  pendidikan,
  pengalaman,
  keahlian,
}: CVProps) {
  return (
    <div className="min-h-[297mm] px-[20mm] py-[18mm] text-[13px]">

      <div className="flex items-start justify-between border-b pb-7">

        <div>

          <h1 className="break-words text-[34px] font-light leading-tight">
            {nama || "Nama Lengkap"}
          </h1>

          <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-slate-500">
            {[email, telepon, lokasi]
              .filter(Boolean)
              .join("  •  ") ||
              "EMAIL • TELEPON • KOTA"}
          </p>

        </div>

        {foto && (
          <img
            src={foto}
            alt="Foto profil"
            className="h-[25mm] w-[25mm] rounded-full object-cover"
          />
        )}

      </div>

      <div className="pt-8">

        <CVSection title="Profile">

          <p className="whitespace-pre-line leading-7 text-slate-700">
            {tentang ||
              "Tulis profil profesionalmu."}
          </p>

        </CVSection>

        <CVSection title="Experience">

          {pengalaman
            .filter(
              (item) =>
                item.company ||
                item.position ||
                item.description
            )
            .map((item) => (

              <div
                key={item.id}
                className="mb-6"
              >

                <h3 className="font-semibold">
                  {item.position}
                </h3>

                <div className="mt-1 flex justify-between gap-5">

                  <p className="text-slate-600">
                    {item.company}
                  </p>

                  <span className="shrink-0 text-xs text-slate-500">
                    {item.year}
                  </span>

                </div>

                <p className="mt-2 whitespace-pre-line leading-6 text-slate-700">
                  {item.description}
                </p>

              </div>

            ))}

        </CVSection>

        <CVSection title="Education">

          {pendidikan
            .filter(
              (item) =>
                item.school ||
                item.major ||
                item.description
            )
            .map((item) => (

              <div
                key={item.id}
                className="mb-5"
              >

                <div className="flex justify-between gap-5">

                  <div>

                    <h3 className="font-semibold">
                      {item.school}
                    </h3>

                    <p className="text-slate-600">
                      {item.major}
                    </p>

                  </div>

                  <span className="shrink-0 text-xs text-slate-500">
                    {item.year}
                  </span>

                </div>

                <p className="mt-2 whitespace-pre-line text-slate-700">
                  {item.description}
                </p>

              </div>

            ))}

        </CVSection>

        <CVSection title="Skills">

          <p className="leading-7 text-slate-700">
            {keahlian ||
              "Microsoft Office • Komunikasi • Teamwork"}
          </p>

        </CVSection>

      </div>

    </div>
  );
}

