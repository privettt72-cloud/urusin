
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
          Kalkulator Diskon
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Hitung harga setelah diskon, jumlah
          penghematan, dan harga akhir setelah
          pajak.
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
              Masukkan harga barang dan
              persentase diskon.
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
              🧮 Cara Menghitung
            </h2>

            <div className="space-y-3 text-sm leading-6 text-slate-600">

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="font-bold text-slate-900">
                  1. Nilai Diskon
                </p>

                <p>
                  Harga awal × persentase diskon
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="font-bold text-slate-900">
                  2. Harga Setelah Diskon
                </p>

                <p>
                  Harga awal − nilai diskon
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="font-bold text-slate-900">
                  3. Pajak
                </p>

                <p>
                  Harga setelah diskon × persentase pajak
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="font-bold text-slate-900">
                  4. Harga Akhir
                </p>

                <p>
                  Harga setelah diskon + pajak
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

        {formatCurrency(value)}

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
   FORMAT CURRENCY
======================================== */

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

