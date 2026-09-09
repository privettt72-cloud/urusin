"use client";

import { useMemo, useState } from "react";

export default function KalkulatorTHRPage() {
  const [gajiPokok, setGajiPokok] = useState("");
  const [tunjangan, setTunjangan] = useState("");
  const [masaKerja, setMasaKerja] = useState("12");

  const angka = (value: string) => {
    return Number(value.replace(/[^\d]/g, "")) || 0;
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const hasil = useMemo(() => {
    const pokok = angka(gajiPokok);
    const tunjanganTetap = angka(tunjangan);
    const bulan = Number(masaKerja);

    const upahSebulan = pokok + tunjanganTetap;

    let faktor = 1;

    if (bulan < 12) {
      faktor = bulan / 12;
    }

    const thr = upahSebulan * faktor;

    return {
      pokok,
      tunjanganTetap,
      bulan,
      upahSebulan,
      faktor,
      thr,
    };
  }, [gajiPokok, tunjangan, masaKerja]);

  const reset = () => {
    setGajiPokok("");
    setTunjangan("");
    setMasaKerja("12");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <a
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Urusin
            <span className="text-blue-600">.</span>
          </a>

          <a
            href="/"
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
          >
            ← Kembali
          </a>

        </div>
      </header>


      {/* HERO */}

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-10">

        <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
          🎁 Urusin Tools
        </div>

        <h1 className="text-3xl font-black md:text-4xl">
          Kalkulator THR Online
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Hitung perkiraan Tunjangan Hari Raya (THR)
          berdasarkan gaji, tunjangan tetap, dan masa kerja.
          Kalkulator ini dapat digunakan untuk memperkirakan
          THR 1 bulan maupun THR proporsional untuk masa kerja
          kurang dari 12 bulan.
        </p>

      </section>


      {/* CONTENT */}

      <div className="mx-auto grid max-w-6xl gap-7 px-5 pb-20 lg:grid-cols-[420px_1fr]">

        {/* FORM */}

        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-xl font-black">
              🧾 Data Penghasilan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Masukkan data penghasilan kamu.
            </p>

          </div>


          <div className="space-y-5">

            {/* GAJI */}

            <MoneyInput
              label="Gaji Pokok"
              value={gajiPokok}
              onChange={setGajiPokok}
              placeholder="Contoh: 5000000"
              required
            />


            {/* TUNJANGAN */}

            <MoneyInput
              label="Tunjangan Tetap"
              value={tunjangan}
              onChange={setTunjangan}
              placeholder="Contoh: 500000"
            />


            {/* MASA KERJA */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Masa Kerja
              </label>

              <select
                value={masaKerja}
                onChange={(e) =>
                  setMasaKerja(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >

                <option value="1">
                  1 bulan
                </option>

                <option value="2">
                  2 bulan
                </option>

                <option value="3">
                  3 bulan
                </option>

                <option value="4">
                  4 bulan
                </option>

                <option value="5">
                  5 bulan
                </option>

                <option value="6">
                  6 bulan
                </option>

                <option value="7">
                  7 bulan
                </option>

                <option value="8">
                  8 bulan
                </option>

                <option value="9">
                  9 bulan
                </option>

                <option value="10">
                  10 bulan
                </option>

                <option value="11">
                  11 bulan
                </option>

                <option value="12">
                  12 bulan atau lebih
                </option>

              </select>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Masa kerja kurang dari 12 bulan
                dihitung secara proporsional.
              </p>

            </div>

          </div>


          {/* BUTTON */}

          <div className="mt-6 grid grid-cols-2 gap-3">

            <button
              onClick={reset}
              className="rounded-xl border border-slate-200 py-3 text-sm font-bold hover:bg-slate-50"
            >
              🗑️ Reset
            </button>

            <a
              href="#hasil"
              className="rounded-xl bg-blue-600 py-3 text-center text-sm font-black text-white hover:bg-blue-700"
            >
              Lihat Hasil
            </a>

          </div>

        </section>


        {/* RESULT */}

        <section
          id="hasil"
          className="space-y-5"
        >

          {/* MAIN RESULT */}

          <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">

            <div className="p-6 md:p-8">

              <p className="text-sm font-bold text-slate-300">
                🎁 Perkiraan THR
              </p>

              <div className="mt-3 break-words text-3xl font-black md:text-5xl">
                {formatRupiah(hasil.thr)}
              </div>

              <p className="mt-3 text-sm text-slate-400">
                Berdasarkan masa kerja{" "}
                <strong className="text-white">
                  {hasil.bulan >= 12
                    ? "12 bulan atau lebih"
                    : `${hasil.bulan} bulan`}
                </strong>
                .
              </p>

            </div>

          </div>


          {/* STATUS */}

          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">

            <p className="text-xs font-bold text-green-700">
              📌 Status Perhitungan
            </p>

            <p className="mt-2 text-sm leading-6 text-green-800">

              {hasil.bulan >= 12
                ? "Masa kerja sudah mencapai 12 bulan atau lebih, sehingga estimasi THR adalah sebesar 1 bulan upah."
                : `Masa kerja ${hasil.bulan} bulan, sehingga estimasi THR dihitung secara proporsional sebesar ${(
                    hasil.faktor * 100
                  ).toFixed(2)}% dari 1 bulan upah.`}

            </p>

          </div>


          {/* SUMMARY */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-black">
              📊 Ringkasan
            </h2>

            <div className="space-y-4">

              <SummaryRow
                label="Gaji Pokok"
                value={hasil.pokok}
              />

              <SummaryRow
                label="Tunjangan Tetap"
                value={hasil.tunjanganTetap}
              />

              <div className="border-t pt-4">

                <SummaryRow
                  label="Upah Sebulan"
                  value={hasil.upahSebulan}
                  bold
                />

              </div>


              <SummaryRow
                label="Masa Kerja"
                text={
                  hasil.bulan >= 12
                    ? "12 bulan atau lebih"
                    : `${hasil.bulan} bulan`
                }
              />


              <SummaryRow
                label="Faktor THR"
                text={`${hasil.faktor.toFixed(4)} bulan`}
              />


              <div className="border-t pt-4">

                <SummaryRow
                  label="Perkiraan THR"
                  value={hasil.thr}
                  bold
                  large
                />

              </div>

            </div>

          </div>


          {/* RUMUS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-black">
              🧮 Rumus Perhitungan
            </h2>

            <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">

              <p>
                <strong>Upah sebulan</strong>
                {" = "}
                gaji pokok + tunjangan tetap
              </p>

              {hasil.bulan < 12 ? (
                <p>
                  <strong>THR</strong>
                  {" = "}
                  masa kerja ÷ 12 × upah sebulan
                </p>
              ) : (
                <p>
                  <strong>THR</strong>
                  {" = "}
                  1 × upah sebulan
                </p>
              )}

            </div>

          </div>


          {/* CONTOH */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-black">
              💡 Contoh Perhitungan
            </h2>

            <div className="rounded-xl border border-slate-200 p-4">

              <p className="text-sm leading-6 text-slate-600">

                Jika upah sebulan kamu{" "}
                <strong className="text-slate-900">
                  Rp6.000.000
                </strong>{" "}
                dan masa kerja{" "}
                <strong className="text-slate-900">
                  6 bulan
                </strong>
                , maka:

              </p>

              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm font-bold">

                6 ÷ 12 × Rp6.000.000 ={" "}
                {formatRupiah(3000000)}

              </div>

            </div>

          </div>


          {/* INFO */}

          <div className="grid gap-4 sm:grid-cols-3">

            <Info
              icon="⚡"
              title="Cepat"
              text="Hasil perhitungan muncul langsung."
            />

            <Info
              icon="🔒"
              title="Privasi"
              text="Data diproses langsung di browser."
            />

            <Info
              icon="📱"
              title="Praktis"
              text="Bisa digunakan dari HP maupun komputer."
            />

          </div>


          {/* DISCLAIMER */}

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">

            <p className="text-sm leading-6 text-amber-800">

              <strong>Catatan:</strong>{" "}
              hasil ini adalah estimasi. Perhitungan
              THR aktual dapat bergantung pada
              ketentuan yang berlaku, komponen upah,
              masa kerja, status hubungan kerja,
              dan kebijakan perusahaan.

            </p>

          </div>


          {/* SEO CONTENT */}

          <section className="space-y-5 pt-5">

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-black">
                Kalkulator THR untuk Menghitung Tunjangan Hari Raya
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">

                <p>
                  Kalkulator THR Urusin membantu memperkirakan
                  Tunjangan Hari Raya berdasarkan gaji, tunjangan
                  tetap, dan masa kerja. Kamu dapat menggunakan
                  kalkulator ini untuk mengetahui perkiraan THR
                  apabila masa kerja sudah mencapai 12 bulan
                  maupun jika masa kerja masih kurang dari 12 bulan.
                </p>

                <p>
                  Untuk masa kerja kurang dari 12 bulan, perhitungan
                  THR dilakukan secara proporsional berdasarkan
                  masa kerja dibandingkan dengan 12 bulan. Jika
                  masa kerja sudah mencapai 12 bulan atau lebih,
                  kalkulator menggunakan faktor 1 bulan upah.
                </p>

                <p>
                  Hasil yang ditampilkan merupakan estimasi berdasarkan
                  data yang kamu masukkan. Nilai THR sebenarnya dapat
                  bergantung pada ketentuan yang berlaku dan komponen
                  upah yang digunakan oleh perusahaan.
                </p>

              </div>

            </div>


            {/* CARA MENGHITUNG */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-black">
                Cara Menghitung THR
              </h2>

              <div className="mt-5 space-y-4">

                <SeoCard
                  title="1. Hitung upah sebulan"
                  text="Jumlahkan gaji pokok dengan tunjangan tetap yang menjadi dasar perhitungan."
                />

                <SeoCard
                  title="2. Tentukan masa kerja"
                  text="Masa kerja digunakan untuk menentukan apakah THR diberikan sebesar satu bulan upah atau dihitung secara proporsional."
                />

                <SeoCard
                  title="3. Hitung THR proporsional"
                  text="Untuk masa kerja kurang dari 12 bulan, gunakan perbandingan masa kerja dibagi 12 lalu kalikan dengan upah sebulan."
                />

                <SeoCard
                  title="4. Tentukan perkiraan THR"
                  text="Untuk masa kerja 12 bulan atau lebih, estimasi THR pada kalkulator ini menggunakan faktor satu bulan upah."
                />

              </div>

            </div>


            {/* MASA KERJA */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-black">
                Contoh THR Berdasarkan Masa Kerja
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Misalnya upah sebulan adalah Rp6.000.000.
                Perkiraan THR berdasarkan masa kerja dapat
                dihitung secara proporsional untuk masa kerja
                kurang dari 12 bulan.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <SeoCard
                  title="THR 3 bulan"
                  text="3 ÷ 12 × Rp6.000.000 = Rp1.500.000."
                />

                <SeoCard
                  title="THR 6 bulan"
                  text="6 ÷ 12 × Rp6.000.000 = Rp3.000.000."
                />

                <SeoCard
                  title="THR 9 bulan"
                  text="9 ÷ 12 × Rp6.000.000 = Rp4.500.000."
                />

                <SeoCard
                  title="THR 12 bulan"
                  text="Masa kerja 12 bulan atau lebih menggunakan estimasi 1 bulan upah, yaitu Rp6.000.000."
                />

              </div>

            </div>


            {/* KOMPONEN */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-black">
                Komponen yang Digunakan dalam Kalkulator THR
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <SeoCard
                  title="Gaji Pokok"
                  text="Masukkan gaji pokok sesuai dengan penghasilan bulanan yang menjadi dasar perhitungan."
                />

                <SeoCard
                  title="Tunjangan Tetap"
                  text="Masukkan tunjangan tetap jika ada dan termasuk dalam komponen upah yang digunakan untuk perhitungan."
                />

                <SeoCard
                  title="Masa Kerja"
                  text="Pilih masa kerja mulai dari 1 bulan sampai 12 bulan atau lebih."
                />

                <SeoCard
                  title="Perkiraan THR"
                  text="Hasil akhir menunjukkan estimasi THR berdasarkan data penghasilan dan masa kerja yang dimasukkan."
                />

              </div>

            </div>


            {/* CARA MENGGUNAKAN */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-black">
                Cara Menggunakan Kalkulator THR
              </h2>

              <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-600">

                <li>
                  <strong className="text-slate-900">
                    Masukkan gaji pokok.
                  </strong>{" "}
                  Isi nominal gaji pokok bulanan.
                </li>

                <li>
                  <strong className="text-slate-900">
                    Masukkan tunjangan tetap.
                  </strong>{" "}
                  Jika tidak ada, bagian ini dapat dikosongkan.
                </li>

                <li>
                  <strong className="text-slate-900">
                    Pilih masa kerja.
                  </strong>{" "}
                  Tentukan jumlah bulan masa kerja.
                </li>

                <li>
                  <strong className="text-slate-900">
                    Lihat hasil.
                  </strong>{" "}
                  Kalkulator akan langsung menampilkan perkiraan
                  THR berdasarkan data yang dimasukkan.
                </li>

              </ol>

            </div>


            {/* FAQ */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-black">
                FAQ Kalkulator THR
              </h2>

              <div className="mt-5 space-y-4">

                <Faq
                  question="Apa itu kalkulator THR?"
                  answer="Kalkulator THR adalah alat untuk membantu memperkirakan jumlah Tunjangan Hari Raya berdasarkan penghasilan dan masa kerja."
                />

                <Faq
                  question="Bagaimana cara menghitung THR?"
                  answer="Untuk masa kerja kurang dari 12 bulan, perkiraan THR dihitung dengan rumus masa kerja dibagi 12 kemudian dikalikan dengan upah sebulan. Untuk masa kerja 12 bulan atau lebih, estimasinya menggunakan satu bulan upah."
                />

                <Faq
                  question="Berapa THR jika masa kerja 6 bulan?"
                  answer="Jika upah sebulan Rp6.000.000 dan masa kerja 6 bulan, perkiraan THR adalah 6 ÷ 12 × Rp6.000.000 atau Rp3.000.000."
                />

                <Faq
                  question="Berapa THR jika masa kerja 3 bulan?"
                  answer="Jika upah sebulan Rp6.000.000 dan masa kerja 3 bulan, perkiraan THR adalah 3 ÷ 12 × Rp6.000.000 atau Rp1.500.000."
                />

                <Faq
                  question="Apakah tunjangan tetap dihitung dalam kalkulator THR?"
                  answer="Kalkulator ini menggunakan gaji pokok ditambah tunjangan tetap sebagai upah sebulan yang menjadi dasar estimasi."
                />

                <Faq
                  question="Apakah kalkulator THR ini gratis?"
                  answer="Ya. Kalkulator THR Urusin dapat digunakan secara gratis melalui browser tanpa perlu menginstal aplikasi."
                />

                <Faq
                  question="Apakah hasil kalkulator THR merupakan jumlah THR resmi?"
                  answer="Tidak. Hasil kalkulator merupakan estimasi berdasarkan data yang dimasukkan. Jumlah THR sebenarnya dapat bergantung pada ketentuan yang berlaku, komponen upah, dan kondisi hubungan kerja."
                />

              </div>

            </div>

          </section>

        </section>

      </div>


      {/* FOOTER */}

      <footer className="border-t bg-white py-7 text-center">

        <p className="text-xs text-slate-400">
          © 2026 Urusin. Semua hak dilindungi.
        </p>

      </footer>

    </main>
  );
}


/* ========================================
   MONEY INPUT
======================================== */

function MoneyInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">

        <span className="flex items-center bg-slate-50 px-4 text-sm font-bold text-slate-500">
          Rp
        </span>

        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value.replace(
                /[^\d]/g,
                ""
              )
            )
          }
          placeholder={placeholder}
          className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
        />

      </div>

    </div>
  );
}


/* ========================================
   SUMMARY
======================================== */

function SummaryRow({
  label,
  value,
  text,
  bold = false,
  large = false,
}: {
  label: string;
  value?: number;
  text?: string;
  bold?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        bold ? "font-black" : ""
      }`}
    >

      <span
        className={
          large
            ? "text-lg"
            : "text-sm text-slate-600"
        }
      >
        {label}
      </span>

      <span
        className={`text-right ${
          large ? "text-xl" : ""
        }`}
      >
        {text !== undefined
          ? text
          : formatCurrency(value || 0)}
      </span>

    </div>
  );
}


/* ========================================
   INFO
======================================== */

function Info({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">

      <div className="mb-2 text-2xl">
        {icon}
      </div>

      <h3 className="font-bold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}


/* ========================================
   SEO CARD
======================================== */

function SeoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">

      <h3 className="font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>
  );
}


/* ========================================
   FAQ
======================================== */

function Faq({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="rounded-xl border border-slate-200 p-4">

      <summary className="cursor-pointer font-bold text-slate-900">
        {question}
      </summary>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {answer}
      </p>

    </details>
  );
}


/* ========================================
   FORMAT
======================================== */

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}