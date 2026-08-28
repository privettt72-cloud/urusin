
"use client";

import { useMemo, useState } from "react";

export default function KalkulatorGajiPage() {
  const [gajiPokok, setGajiPokok] = useState("");
  const [tunjangan, setTunjangan] = useState("");
  const [lembur, setLembur] = useState("");
  const [bonus, setBonus] = useState("");
  const [potongan, setPotongan] = useState("");

  const angka = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, "");
    return Number(cleaned) || 0;
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
    const tunjanganValue = angka(tunjangan);
    const lemburValue = angka(lembur);
    const bonusValue = angka(bonus);
    const potonganValue = angka(potongan);

    const pendapatanKotor =
      pokok +
      tunjanganValue +
      lemburValue +
      bonusValue;

    const gajiBersih =
      pendapatanKotor - potonganValue;

    return {
      pokok,
      tunjangan: tunjanganValue,
      lembur: lemburValue,
      bonus: bonusValue,
      potongan: potonganValue,
      pendapatanKotor,
      gajiBersih: Math.max(0, gajiBersih),
    };
  }, [
    gajiPokok,
    tunjangan,
    lembur,
    bonus,
    potongan,
  ]);

  const reset = () => {
    setGajiPokok("");
    setTunjangan("");
    setLembur("");
    setBonus("");
    setPotongan("");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

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
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
          >
            ← Kembali
          </a>

        </div>

      </header>


      {/* HERO */}

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-10">

        <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
          💰 Urusin Tools
        </div>

        <h1 className="text-3xl font-black md:text-4xl">
          Kalkulator Gaji
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Hitung perkiraan total pendapatan dan
          gaji bersih berdasarkan gaji pokok,
          tunjangan, lembur, bonus, dan potongan.
        </p>

      </section>


      {/* CONTENT */}

      <div className="mx-auto grid max-w-6xl gap-7 px-5 pb-20 lg:grid-cols-[420px_1fr]">

        {/* FORM */}

        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-xl font-black">
              🧾 Rincian Gaji
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Masukkan nominal dalam rupiah.
            </p>

          </div>


          <div className="space-y-5">

            <MoneyInput
              label="Gaji Pokok"
              value={gajiPokok}
              onChange={setGajiPokok}
              placeholder="Contoh: 5000000"
              required
            />

            <MoneyInput
              label="Tunjangan"
              value={tunjangan}
              onChange={setTunjangan}
              placeholder="Contoh: 500000"
            />

            <MoneyInput
              label="Lembur"
              value={lembur}
              onChange={setLembur}
              placeholder="Contoh: 300000"
            />

            <MoneyInput
              label="Bonus"
              value={bonus}
              onChange={setBonus}
              placeholder="Contoh: 1000000"
            />

            <MoneyInput
              label="Total Potongan"
              value={potongan}
              onChange={setPotongan}
              placeholder="Contoh: 250000"
            />

          </div>


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
                💵 Perkiraan Gaji Bersih
              </p>

              <div className="mt-3 break-words text-3xl font-black md:text-5xl">
                {formatRupiah(
                  hasil.gajiBersih
                )}
              </div>

              <p className="mt-3 text-sm text-slate-400">
                Pendapatan setelah dikurangi
                seluruh potongan yang kamu masukkan.
              </p>

            </div>

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
                label="Tunjangan"
                value={hasil.tunjangan}
              />

              <SummaryRow
                label="Lembur"
                value={hasil.lembur}
              />

              <SummaryRow
                label="Bonus"
                value={hasil.bonus}
              />

              <div className="my-2 border-t" />

              <SummaryRow
                label="Pendapatan Kotor"
                value={hasil.pendapatanKotor}
                bold
              />

              <SummaryRow
                label="Potongan"
                value={-hasil.potongan}
                negative
              />

              <div className="border-t pt-4">

                <SummaryRow
                  label="Gaji Bersih"
                  value={hasil.gajiBersih}
                  bold
                  large
                />

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
              hasil ini merupakan estimasi berdasarkan
              angka yang kamu masukkan. Perhitungan
              gaji sebenarnya dapat berbeda karena
              pajak, BPJS, lembur, tunjangan, dan
              kebijakan perusahaan.

            </p>

          </div>

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
   SUMMARY ROW
======================================== */

function SummaryRow({
  label,
  value,
  bold = false,
  negative = false,
  large = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
  negative?: boolean;
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
        className={`whitespace-nowrap ${
          large ? "text-xl" : ""
        } ${
          negative
            ? "text-red-500"
            : ""
        }`}
      >
        {formatCurrency(value)}
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
   FORMAT
======================================== */

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

