
"use client";

import { useMemo, useState } from "react";

export default function KalkulatorCicilanPage() {
  const [harga, setHarga] = useState("");
  const [dp, setDp] = useState("");
  const [tenor, setTenor] = useState("12");
  const [bunga, setBunga] = useState("10");

  const toNumber = (value: string) => {
    return Number(value.replace(/[^\d]/g, "")) || 0;
  };

  const hasil = useMemo(() => {
    const hargaBarang = toNumber(harga);
    const uangMuka = Math.min(toNumber(dp), hargaBarang);

    const jumlahPinjaman = Math.max(
      hargaBarang - uangMuka,
      0
    );

    const jumlahTenor = Number(tenor) || 1;
    const bungaTahunan = Number(bunga) || 0;

    /*
     * Metode bunga flat.
     *
     * Bunga per bulan =
     * pokok pinjaman × bunga tahunan / 12
     *
     * Total bunga =
     * bunga per bulan × tenor
     *
     * Cicilan =
     * pokok / tenor + bunga per bulan
     */

    const bungaBulanan =
      jumlahPinjaman *
      (bungaTahunan / 100) /
      12;

    const totalBunga =
      bungaBulanan * jumlahTenor;

    const cicilanPokok =
      jumlahPinjaman / jumlahTenor;

    const cicilanPerBulan =
      cicilanPokok + bungaBulanan;

    const totalCicilan =
      jumlahPinjaman + totalBunga;

    const totalPembayaran =
      uangMuka + totalCicilan;

    return {
      hargaBarang,
      uangMuka,
      jumlahPinjaman,
      jumlahTenor,
      bungaTahunan,
      bungaBulanan,
      totalBunga,
      cicilanPokok,
      cicilanPerBulan,
      totalCicilan,
      totalPembayaran,
    };
  }, [harga, dp, tenor, bunga]);

  const reset = () => {
    setHarga("");
    setDp("");
    setTenor("12");
    setBunga("10");
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
          💳 Urusin Tools
        </div>

        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
          Kalkulator Cicilan
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Hitung estimasi cicilan per bulan,
          total bunga, dan total pembayaran
          berdasarkan harga barang, DP, tenor,
          dan bunga.
        </p>

      </section>


      {/* ================= CONTENT ================= */}

      <div className="mx-auto grid max-w-6xl gap-7 px-5 pb-20 lg:grid-cols-[420px_1fr]">

        {/* ================= FORM ================= */}

        <section className="h-fit rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-xl font-black">
              🧾 Rincian Cicilan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Masukkan data barang atau pinjaman
              yang ingin kamu hitung.
            </p>

          </div>


          <div className="space-y-5">

            {/* HARGA */}

            <MoneyInput
              label="Harga Barang / Pinjaman"
              value={harga}
              onChange={setHarga}
              placeholder="Contoh: 12000000"
              required
            />


            {/* DP */}

            <MoneyInput
              label="Uang Muka / DP"
              value={dp}
              onChange={setDp}
              placeholder="Contoh: 2000000"
            />


            {/* TENOR */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Tenor
              </label>

              <select
                value={tenor}
                onChange={(e) =>
                  setTenor(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="3">
                  3 bulan
                </option>

                <option value="6">
                  6 bulan
                </option>

                <option value="9">
                  9 bulan
                </option>

                <option value="12">
                  12 bulan
                </option>

                <option value="18">
                  18 bulan
                </option>

                <option value="24">
                  24 bulan
                </option>

                <option value="36">
                  36 bulan
                </option>

                <option value="48">
                  48 bulan
                </option>

                <option value="60">
                  60 bulan
                </option>
              </select>

            </div>


            {/* BUNGA */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Bunga per Tahun
              </label>

              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={bunga}
                  onChange={(e) => {

                    let value =
                      e.target.value;

                    const numberValue =
                      Number(value);

                    if (numberValue > 100) {
                      value = "100";
                    }

                    if (numberValue < 0) {
                      value = "0";
                    }

                    setBunga(value);

                  }}
                  className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                  placeholder="Contoh: 10"
                />

                <span className="flex items-center bg-slate-50 px-4 text-sm font-bold text-slate-500">
                  %
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Perhitungan menggunakan metode
                bunga flat.
              </p>

            </div>

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

          {/* CICILAN UTAMA */}

          <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">

            <div className="p-6 md:p-8">

              <p className="text-sm font-bold text-slate-300">
                💳 Estimasi Cicilan per Bulan
              </p>

              <div className="mt-3 break-words text-3xl font-black md:text-5xl">
                {formatCurrency(
                  hasil.cicilanPerBulan
                )}
              </div>

              <p className="mt-3 text-sm text-slate-400">
                Selama{" "}
                <strong className="text-white">
                  {hasil.jumlahTenor} bulan
                </strong>{" "}
                dengan bunga{" "}
                <strong className="text-white">
                  {hasil.bungaTahunan}%
                </strong>{" "}
                per tahun.
              </p>

            </div>

          </div>


          {/* PINJAMAN */}

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <p className="text-xs font-bold text-blue-700">
              💰 Jumlah yang Dicicil
            </p>

            <div className="mt-2 text-2xl font-black text-blue-900">
              {formatCurrency(
                hasil.jumlahPinjaman
              )}
            </div>

            <p className="mt-1 text-sm leading-6 text-blue-700">

              Harga{" "}
              {formatCurrency(
                hasil.hargaBarang
              )}{" "}

              dikurangi DP{" "}

              {formatCurrency(
                hasil.uangMuka
              )}

              .

            </p>

          </div>


          {/* RINGKASAN */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-black">
              📊 Ringkasan
            </h2>

            <div className="space-y-4">

              <SummaryRow
                label="Harga Barang"
                value={hasil.hargaBarang}
              />

              <SummaryRow
                label="Uang Muka / DP"
                value={hasil.uangMuka}
                negative
              />

              <div className="border-t pt-4">

                <SummaryRow
                  label="Pokok Pinjaman"
                  value={hasil.jumlahPinjaman}
                  bold
                />

              </div>

              <SummaryRow
                label={`Tenor`}
                value={hasil.jumlahTenor}
                suffix=" bulan"
              />

              <SummaryRow
                label={`Bunga ${hasil.bungaTahunan}% / tahun`}
                value={hasil.totalBunga}
              />

              <SummaryRow
                label="Total Cicilan"
                value={hasil.totalCicilan}
                bold
              />

              <div className="border-t pt-4">

                <SummaryRow
                  label="Total Pembayaran"
                  value={hasil.totalPembayaran}
                  bold
                  large
                />

              </div>

            </div>

          </div>


          {/* DETAIL CICILAN */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-black">
              🧮 Detail Perhitungan
            </h2>

            <div className="space-y-3">

              <DetailRow
                label="Pokok per bulan"
                value={hasil.cicilanPokok}
              />

              <DetailRow
                label="Bunga per bulan"
                value={hasil.bungaBulanan}
              />

              <DetailRow
                label="Cicilan per bulan"
                value={hasil.cicilanPerBulan}
                bold
              />

            </div>

          </div>


          {/* CONTOH */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-black">
              💡 Contoh Perhitungan
            </h2>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm leading-6 text-slate-600">

                Misalnya harga barang{" "}

                <strong className="text-slate-900">
                  Rp12.000.000
                </strong>
                , DP{" "}

                <strong className="text-slate-900">
                  Rp2.000.000
                </strong>
                , tenor{" "}

                <strong className="text-slate-900">
                  12 bulan
                </strong>{" "}

                dan bunga{" "}

                <strong className="text-slate-900">
                  10% per tahun
                </strong>
                .

              </p>

              <div className="mt-4 space-y-2 text-sm">

                <p>
                  Pokok pinjaman =
                  Rp12.000.000 − Rp2.000.000
                </p>

                <p>
                  Pokok pinjaman =
                  <strong>
                    Rp10.000.000
                  </strong>
                </p>

                <p>
                  Bunga per bulan =
                  Rp10.000.000 × 10% ÷ 12
                </p>

                <p>
                  Bunga per bulan =
                  <strong>
                    Rp83.333
                  </strong>
                </p>

              </div>

            </div>

          </div>


          {/* RUMUS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-black">
              🧮 Rumus Perhitungan
            </h2>

            <div className="space-y-3 text-sm leading-6 text-slate-600">

              <Formula
                number="1"
                title="Pokok Pinjaman"
                formula="Harga barang − DP"
              />

              <Formula
                number="2"
                title="Bunga per Bulan"
                formula="Pokok pinjaman × bunga tahunan ÷ 12"
              />

              <Formula
                number="3"
                title="Pokok per Bulan"
                formula="Pokok pinjaman ÷ tenor"
              />

              <Formula
                number="4"
                title="Cicilan per Bulan"
                formula="Pokok per bulan + bunga per bulan"
              />

              <Formula
                number="5"
                title="Total Pembayaran"
                formula="DP + total cicilan"
              />

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

              hasil kalkulator ini merupakan
              estimasi menggunakan metode bunga
              flat. Perhitungan cicilan sebenarnya
              dapat berbeda tergantung bank,
              leasing, fintech, biaya administrasi,
              asuransi, bunga efektif, dan ketentuan
              penyedia pembiayaan.

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
   SUMMARY ROW
======================================== */

function SummaryRow({
  label,
  value,
  bold = false,
  large = false,
  negative = false,
  suffix = "",
}: {
  label: string;
  value: number;
  bold?: boolean;
  large?: boolean;
  negative?: boolean;
  suffix?: string;
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

        {suffix
          ? `${value}${suffix}`
          : formatCurrency(value)}

      </span>

    </div>
  );
}


/* ========================================
   DETAIL ROW
======================================== */

function DetailRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 ${
        bold ? "font-black" : ""
      }`}
    >

      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span className="text-sm">
        {formatCurrency(value)}
      </span>

    </div>
  );
}


/* ========================================
   FORMULA
======================================== */

function Formula({
  number,
  title,
  formula,
}: {
  number: string;
  title: string;
  formula: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="font-bold text-slate-900">
        {number}. {title}
      </p>

      <p className="mt-1">
        {formula}
      </p>

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
