"use client";

import { useMemo, useState } from "react";

export default function KalkulatorDiskonPage() {
  const [harga, setHarga] = useState("");
  const [diskon, setDiskon] = useState("");
  const [pajak, setPajak] = useState("");

  const angka = (value: string) => {
    return Number(value.replace(/[^\d]/g, "")) || 0;
  };

  const hasil = useMemo(() => {
    const hargaAwal = angka(harga);

    let persenDiskon = Number(diskon) || 0;
    let persenPajak = Number(pajak) || 0;

    // Batasi persentase agar tidak menghasilkan angka aneh
    persenDiskon = Math.min(
      Math.max(persenDiskon, 0),
      100
    );

    persenPajak = Math.min(
      Math.max(persenPajak, 0),
      100
    );

    const nilaiDiskon =
      hargaAwal * (persenDiskon / 100);

    const hargaSetelahDiskon =
      hargaAwal - nilaiDiskon;

    const nilaiPajak =
      hargaSetelahDiskon *
      (persenPajak / 100);

    const hargaAkhir =
      hargaSetelahDiskon + nilaiPajak;

    return {
      hargaAwal,
      persenDiskon,
      nilaiDiskon,
      hargaSetelahDiskon,
      persenPajak,
      nilaiPajak,
      hargaAkhir,
    };
  }, [harga, diskon, pajak]);

  const reset = () => {
    setHarga("");
    setDiskon("");
    setPajak("");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= HEADER ================= */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <a
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Urusin
            <span className="text-blue-600">
              .
            </span>
          </a>

          <a
            href="/"
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
          >
            ← Kembali
          </a>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-10">

        <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
          💸 Urusin Tools
        </div>

        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
          Kalkulator Diskon Online
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Hitung persentase diskon, harga setelah diskon,
          jumlah penghematan, dan harga akhir setelah
          pajak dengan mudah.
        </p>

      </section>


      {/* ================= CONTENT ================= */}

      <div className="mx-auto grid max-w-6xl gap-7 px-5 pb-20 lg:grid-cols-[420px_1fr]">

        {/* ================= FORM ================= */}

        <section className="h-fit rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-xl font-black">
              🧾 Rincian Harga
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Masukkan harga barang dan persentase diskon.
            </p>

          </div>


          <div className="space-y-5">

            {/* HARGA */}

            <MoneyInput
              label="Harga Awal"
              value={harga}
              onChange={setHarga}
              placeholder="Contoh: 500000"
              required
            />


            {/* DISKON */}

            <PercentInput
              label="Diskon"
              value={diskon}
              onChange={setDiskon}
              placeholder="Contoh: 20"
              required
            />


            {/* PAJAK */}

            <PercentInput
              label="Pajak / PPN"
              value={pajak}
              onChange={setPajak}
              placeholder="Opsional, contoh: 11"
            />

          </div>


          {/* BUTTON */}

          <div className="mt-6 grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-slate-200 py-3 text-sm font-bold transition hover:bg-slate-50"
            >
              🗑️ Reset
            </button>

            <a
              href="#hasil"
              className="rounded-xl bg-blue-600 py-3 text-center text-sm font-black text-white transition hover:bg-blue-700"
            >
              Lihat Hasil
            </a>

          </div>

        </section>


        {/* ================= RESULT ================= */}

        <section
          id="hasil"
          className="space-y-5"
        >

          {/* MAIN RESULT */}

          <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">

            <div className="p-6 md:p-8">

              <p className="text-sm font-bold text-slate-300">
                💰 Harga Setelah Diskon
              </p>

              <div className="mt-3 break-words text-3xl font-black md:text-5xl">
                {formatCurrency(
                  hasil.hargaSetelahDiskon
                )}
              </div>

              <p className="mt-3 text-sm text-slate-400">

                Kamu menghemat{" "}

                <strong className="text-white">
                  {formatCurrency(
                    hasil.nilaiDiskon
                  )}
                </strong>

                .

              </p>

            </div>

          </div>


          {/* HARGA AKHIR */}

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <p className="text-xs font-bold text-blue-700">
              🧮 Harga Akhir
            </p>

            <div className="mt-2 text-2xl font-black text-blue-900">

              {formatCurrency(
                hasil.hargaAkhir
              )}

            </div>

            {hasil.persenPajak > 0 ? (

              <p className="mt-1 text-sm leading-6 text-blue-700">

                Sudah termasuk pajak{" "}
                {hasil.persenPajak}% sebesar{" "}
                {formatCurrency(
                  hasil.nilaiPajak
                )}
                .

              </p>

            ) : (

              <p className="mt-1 text-sm text-blue-700">
                Belum ada pajak yang ditambahkan.
              </p>

            )}

          </div>


          {/* SUMMARY */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-black">
              📊 Ringkasan
            </h2>

            <div className="space-y-4">

              <SummaryRow
                label="Harga Awal"
                value={hasil.hargaAwal}
              />

              <SummaryRow
                label={`Diskon ${hasil.persenDiskon}%`}
                value={hasil.nilaiDiskon}
                negative
              />


              <div className="border-t pt-4">

                <SummaryRow
                  label="Harga Setelah Diskon"
                  value={
                    hasil.hargaSetelahDiskon
                  }
                  bold
                />

              </div>


              {hasil.persenPajak > 0 && (
                <>

                  <SummaryRow
                    label={`Pajak ${hasil.persenPajak}%`}
                    value={hasil.nilaiPajak}
                  />

                  <div className="border-t pt-4">

                    <SummaryRow
                      label="Harga Akhir"
                      value={hasil.hargaAkhir}
                      bold
                      large
                    />

                  </div>

                </>
              )}

            </div>

          </div>


          {/* CONTOH */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-black">
              💡 Contoh Perhitungan
            </h2>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm leading-6 text-slate-600">

                Jika harga barang{" "}

                <strong className="text-slate-900">
                  Rp500.000
                </strong>{" "}

                mendapat diskon{" "}

                <strong className="text-slate-900">
                  20%
                </strong>
                :

              </p>

              <div className="mt-4 space-y-2 text-sm">

                <p>
                  Diskon = 20% × Rp500.000
                </p>

                <p className="font-bold">
                  Hemat = Rp100.000
                </p>

                <p className="font-bold">
                  Harga setelah diskon = Rp400.000
                </p>

              </div>

            </div>

          </div>


          {/* CARA MENGHITUNG */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-black">
              🧮 Cara Menghitung Diskon
            </h2>

            <div className="space-y-3 text-sm leading-6 text-slate-600">

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="font-bold text-slate-900">
                  1. Hitung Nilai Diskon
                </p>

                <p>
                  Harga awal × persentase diskon ÷ 100.
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="font-bold text-slate-900">
                  2. Hitung Harga Setelah Diskon
                </p>

                <p>
                  Harga awal − nilai diskon.
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="font-bold text-slate-900">
                  3. Hitung Pajak Jika Ada
                </p>

                <p>
                  Harga setelah diskon × persentase pajak ÷ 100.
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="font-bold text-slate-900">
                  4. Hitung Harga Akhir
                </p>

                <p>
                  Harga setelah diskon + nilai pajak.
                </p>

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

              kalkulator ini memberikan estimasi
              berdasarkan angka yang kamu masukkan.
              Pajak atau biaya tambahan sebenarnya
              dapat berbeda tergantung produk,
              toko, wilayah, dan ketentuan yang
              berlaku.

            </p>

          </div>

        </section>

      </div>


      {/* ================= SEO CONTENT ================= */}

      <section className="border-t bg-white">

        <div className="mx-auto max-w-4xl px-5 py-14">

          <h2 className="text-2xl font-black md:text-3xl">
            Kalkulator Diskon untuk Menghitung Harga Promo
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">

            <p>
              Kalkulator diskon Urusin dapat digunakan untuk
              menghitung harga barang setelah mendapatkan
              potongan harga. Masukkan harga awal dan
              persentase diskon untuk mengetahui nilai
              diskon, jumlah uang yang dihemat, dan harga
              setelah diskon.
            </p>

            <p>
              Kalkulator ini juga menyediakan kolom pajak
              atau PPN. Jika persentase pajak dimasukkan,
              pajak dihitung berdasarkan harga setelah
              diskon sehingga kamu dapat melihat perkiraan
              harga akhir yang harus dibayar.
            </p>

            <p>
              Kamu dapat menggunakan kalkulator diskon ini
              untuk membantu menghitung harga promo saat
              berbelanja, membandingkan harga barang, atau
              mengetahui berapa besar penghematan dari
              sebuah potongan harga.
            </p>

          </div>


          {/* JENIS PERHITUNGAN */}

          <div className="mt-12">

            <h2 className="text-2xl font-black">
              Apa yang Bisa Dihitung?
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <SeoCard
                title="Persentase Diskon"
                text="Masukkan persentase seperti 10%, 20%, 30%, atau persentase lainnya untuk mengetahui nilai potongan dari harga awal."
              />

              <SeoCard
                title="Harga Setelah Diskon"
                text="Ketahui harga barang setelah dikurangi nilai diskon yang diberikan."
              />

              <SeoCard
                title="Jumlah Penghematan"
                text="Lihat berapa rupiah yang dapat dihemat berdasarkan persentase diskon."
              />

              <SeoCard
                title="Harga Setelah Pajak"
                text="Tambahkan persentase pajak untuk mendapatkan perkiraan harga akhir setelah diskon dan pajak."
              />

            </div>

          </div>


          {/* CARA MENGGUNAKAN */}

          <div className="mt-12">

            <h2 className="text-2xl font-black">
              Cara Menggunakan Kalkulator Diskon
            </h2>

            <ol className="mt-5 space-y-3 text-sm leading-7 text-slate-600">

              <li>
                <strong>1. Masukkan harga awal.</strong>{" "}
                Isi dengan harga barang sebelum diskon.
              </li>

              <li>
                <strong>2. Masukkan persentase diskon.</strong>{" "}
                Contohnya 10%, 20%, atau 50%.
              </li>

              <li>
                <strong>3. Tambahkan pajak jika diperlukan.</strong>{" "}
                Kolom pajak bersifat opsional.
              </li>

              <li>
                <strong>4. Lihat hasil perhitungan.</strong>{" "}
                Kalkulator akan menampilkan nilai diskon,
                harga setelah diskon, dan harga akhir.
              </li>

            </ol>

          </div>


          {/* CONTOH LAIN */}

          <div className="mt-12">

            <h2 className="text-2xl font-black">
              Contoh Menghitung Diskon
            </h2>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <p className="text-sm leading-7 text-slate-600">

                Misalnya sebuah barang memiliki harga
                <strong className="text-slate-900">
                  {" "}Rp1.000.000
                </strong>{" "}
                dan mendapatkan diskon
                <strong className="text-slate-900">
                  {" "}20%
                </strong>.

              </p>

              <div className="mt-4 space-y-2 text-sm leading-6">

                <p>
                  Nilai diskon = 20% × Rp1.000.000
                </p>

                <p>
                  Nilai diskon = Rp200.000
                </p>

                <p className="font-black">
                  Harga setelah diskon = Rp800.000
                </p>

              </div>

            </div>

          </div>


          {/* FAQ */}

          <div className="mt-14">

            <h2 className="text-2xl font-black md:text-3xl">
              FAQ Kalkulator Diskon
            </h2>

            <div className="mt-6 space-y-4">

              <Faq
                question="Bagaimana cara menghitung diskon?"
                answer="Nilai diskon dapat dihitung dengan mengalikan harga awal dengan persentase diskon lalu membaginya dengan 100. Setelah mendapatkan nilai diskon, kurangi harga awal dengan nilai tersebut untuk mendapatkan harga setelah diskon."
              />

              <Faq
                question="Bagaimana cara menghitung harga setelah diskon?"
                answer="Harga setelah diskon diperoleh dengan mengurangi harga awal dengan nilai diskon. Contohnya, harga Rp500.000 dengan diskon 20% mendapatkan potongan Rp100.000 sehingga harga setelah diskon menjadi Rp400.000."
              />

              <Faq
                question="Berapa harga setelah diskon 20%?"
                answer="Hasilnya bergantung pada harga awal. Misalnya harga Rp500.000 mendapat diskon 20%, nilai diskonnya Rp100.000 sehingga harga setelah diskon menjadi Rp400.000."
              />

              <Faq
                question="Apakah kalkulator diskon ini gratis?"
                answer="Ya. Kalkulator diskon Urusin dapat digunakan secara gratis tanpa perlu membuat akun."
              />

              <Faq
                question="Apakah kalkulator bisa menghitung pajak setelah diskon?"
                answer="Bisa. Masukkan persentase pajak pada kolom Pajak atau PPN. Kalkulator akan menghitung pajak berdasarkan harga setelah diskon dan menampilkan perkiraan harga akhirnya."
              />

              <Faq
                question="Apakah kalkulator diskon bisa digunakan untuk belanja?"
                answer="Bisa. Kalkulator ini dapat membantu menghitung harga promo, jumlah penghematan, harga setelah diskon, serta perkiraan harga akhir jika terdapat pajak."
              />

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

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


      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">

        <span className="flex items-center bg-slate-50 px-4 text-sm font-bold text-slate-500">
          Rp
        </span>

        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {

            const clean =
              e.target.value.replace(
                /[^\d]/g,
                ""
              );

            onChange(clean);

          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
        />

      </div>

    </div>
  );
}


/* ========================================
   PERCENT INPUT
======================================== */

function PercentInput({
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


      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">

        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={value}
          onChange={(e) => {

            let valueBaru =
              e.target.value;

            const angkaBaru =
              Number(valueBaru);

            if (angkaBaru > 100) {
              valueBaru = "100";
            }

            if (angkaBaru < 0) {
              valueBaru = "0";
            }

            onChange(valueBaru);

          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
        />

        <span className="flex items-center bg-slate-50 px-4 text-sm font-bold text-slate-500">
          %
        </span>

      </div>

    </div>
  );
}


/* ========================================
   SUMMARY ROW
======================================== */

function SummaryRow({
  label,
  value,
  bold = false,
  large = false,
  negative = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
  large?: boolean;
  negative?: boolean;
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
        } ${
          negative
            ? "text-red-600"
            : ""
        }`}
      >

        {negative && "- "}

        {formatCurrency(
          Math.abs(value)
        )}

      </span>

    </div>
  );
}


/* ========================================
   INFO CARD
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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <h3 className="font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
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
    <details className="group rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <summary className="cursor-pointer list-none pr-6 font-bold">
        {question}
      </summary>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {answer}
      </p>

    </details>
  );
}


/* ========================================
   FORMAT CURRENCY
======================================== */

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}