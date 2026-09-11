
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type TransactionType = "income" | "expense";

type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
};

const STORAGE_KEY = "urusin-keuangan-transactions";

const incomeCategories = [
  "Gaji",
  "Bonus",
  "Freelance",
  "Penjualan",
  "Hadiah",
  "Lainnya",
];

const expenseCategories = [
  "Makanan",
  "Transportasi",
  "Belanja",
  "Tagihan",
  "Hiburan",
  "Kesehatan",
  "Pendidikan",
  "Lainnya",
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function getMonthLabel(month: string) {
  const date = new Date(`${month}-01T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getPreviousMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 2, 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
}

function getNextMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber, 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
}

export default function KeuanganPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<TransactionType>("income");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(incomeCategories[0]);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(getToday());

  // Membaca data yang tersimpan terlebih dahulu.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setTransactions(parsed);
        }
      }
    } catch (error) {
      console.error("Gagal membaca data transaksi:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Baru menyimpan setelah proses membaca data selesai.
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions),
      );
    } catch (error) {
      console.error("Gagal menyimpan data transaksi:", error);
    }
  }, [transactions, isLoaded]);

  const monthTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(selectedMonth),
    );
  }, [transactions, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    let result = [...monthTransactions];

    if (filter !== "all") {
      result = result.filter((transaction) => transaction.type === filter);
    }

    return result.sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }

      return b.id.localeCompare(a.id);
    });
  }, [monthTransactions, filter]);

  const totalIncome = useMemo(() => {
    return monthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [monthTransactions]);

  const totalExpense = useMemo(() => {
    return monthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [monthTransactions]);

  const balance = totalIncome - totalExpense;

  function resetForm() {
    setAmount("");
    setNote("");
    setDate(getToday());
    setEditingId(null);
    setFormType("income");
    setCategory(incomeCategories[0]);
  }

  function openAddForm(type: TransactionType) {
    resetForm();

    setFormType(type);
    setCategory(
      type === "income" ? incomeCategories[0] : expenseCategories[0],
    );

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  function handleTypeChange(type: TransactionType) {
    setFormType(type);

    setCategory(
      type === "income" ? incomeCategories[0] : expenseCategories[0],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount.replace(/\D/g, ""));

    if (!numericAmount || numericAmount <= 0) {
      alert("Masukkan nominal yang valid.");
      return;
    }

    if (!date) {
      alert("Pilih tanggal transaksi.");
      return;
    }

    if (editingId) {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === editingId
            ? {
                ...transaction,
                type: formType,
                amount: numericAmount,
                category,
                note: note.trim(),
                date,
              }
            : transaction,
        ),
      );
    } else {
      const newTransaction: Transaction = {
        id: `${Date.now()}-${Math.random()}`,
        type: formType,
        amount: numericAmount,
        category,
        note: note.trim(),
        date,
      };

      setTransactions((current) => [newTransaction, ...current]);
    }

    closeForm();
  }

  function handleEdit(transaction: Transaction) {
    setEditingId(transaction.id);
    setFormType(transaction.type);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setNote(transaction.note);
    setDate(transaction.date);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Hapus transaksi ini? Data yang dihapus tidak dapat dikembalikan.",
    );

    if (!confirmed) return;

    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id),
    );
  }

  function formatInputAmount(value: string) {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setAmount("");
      return;
    }

    setAmount(Number(digits).toLocaleString("id-ID"));
  }

  const categories =
    formType === "income" ? incomeCategories : expenseCategories;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Urusin Keuangan
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Catat uang masuk dan keluar
                <br className="hidden sm:block" /> dengan mudah.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Catat pemasukan dan pengeluaran dalam beberapa detik agar kamu
                tahu ke mana uangmu pergi setiap bulan.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Periode laporan
              </p>

              <div className="mt-2 flex items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedMonth(getPreviousMonth(selectedMonth))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                  aria-label="Bulan sebelumnya"
                >
                  ←
                </button>

                <div className="min-w-[150px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold capitalize text-slate-700">
                  {getMonthLabel(selectedMonth)}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedMonth(getNextMonth(selectedMonth))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                  aria-label="Bulan berikutnya"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Summary */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">
                Saldo bulan ini
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm">
                Rp
              </div>
            </div>

            <p className="mt-5 text-3xl font-bold tracking-tight">
              {formatRupiah(balance)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Pemasukan dikurangi pengeluaran
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total pemasukan
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                ↗
              </div>
            </div>

            <p className="mt-5 text-2xl font-bold tracking-tight text-emerald-600">
              {formatRupiah(totalIncome)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Uang yang masuk pada periode ini
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total pengeluaran
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                ↘
              </div>
            </div>

            <p className="mt-5 text-2xl font-bold tracking-tight text-red-600">
              {formatRupiah(totalExpense)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Uang yang keluar pada periode ini
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openAddForm("income")}
            className="group rounded-2xl border border-emerald-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl font-semibold text-emerald-600">
                +
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Tambah Pemasukan
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Catat gaji, penjualan, bonus, atau uang masuk lainnya.
                </p>
              </div>

              <span className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500">
                →
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openAddForm("expense")}
            className="group rounded-2xl border border-red-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl font-semibold text-red-600">
                −
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Tambah Pengeluaran
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Catat makanan, transportasi, tagihan, dan pengeluaran lainnya.
                </p>
              </div>

              <span className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-red-500">
                →
              </span>
            </div>
          </button>
        </section>

        {/* Transactions */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Transaksi
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {monthTransactions.length} transaksi pada periode ini.
                </p>
              </div>

              <div className="flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                    filter === "all"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Semua
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("income")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                    filter === "income"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Pemasukan
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("expense")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                    filter === "expense"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Pengeluaran
                </button>
              </div>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                Rp
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Belum ada transaksi
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Mulai catat pemasukan atau pengeluaran supaya kamu bisa melihat
                kondisi keuanganmu dengan lebih jelas.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openAddForm("income")}
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  + Pemasukan
                </button>

                <button
                  type="button"
                  onClick={() => openAddForm("expense")}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  + Pengeluaran
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredTransactions.map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <div
                    key={transaction.id}
                    className="group px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-semibold ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isIncome ? "↗" : "↘"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                          <p className="truncate font-semibold text-slate-900">
                            {transaction.category}
                          </p>

                          <span className="hidden text-slate-300 sm:inline">
                            •
                          </span>

                          <p className="text-xs text-slate-400">
                            {transaction.note || "Tanpa catatan"}
                          </p>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span>{formatDate(transaction.date)}</span>

                          <span>•</span>

                          <span
                            className={
                              isIncome
                                ? "font-medium text-emerald-600"
                                : "font-medium text-red-600"
                            }
                          >
                            {isIncome ? "Pemasukan" : "Pengeluaran"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`whitespace-nowrap text-sm font-bold sm:text-base ${
                            isIncome ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatRupiah(transaction.amount)}
                        </p>

                        <div className="mt-1 flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => handleEdit(transaction)}
                            className="font-medium text-slate-400 transition hover:text-slate-900"
                          >
                            Edit
                          </button>

                          <span className="text-slate-200">|</span>

                          <button
                            type="button"
                            onClick={() => handleDelete(transaction.id)}
                            className="font-medium text-slate-400 transition hover:text-red-600"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* About */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tentang fitur ini
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-950">
              Urusin Keuangan
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Gunakan halaman ini untuk mencatat pemasukan dan pengeluaran
              harian. Untuk versi awal, data disimpan di perangkat yang kamu
              gunakan. Fitur akun, sinkronisasi, backup, dan laporan lanjutan
              dapat ditambahkan pada tahap berikutnya.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-sm text-slate-400">
            Urusin · Biar urusanmu beres.
          </p>
        </footer>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    {editingId
                      ? "Edit Transaksi"
                      : formType === "income"
                        ? "Tambah Pemasukan"
                        : "Tambah Pengeluaran"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Isi detail transaksi di bawah ini.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Jenis transaksi
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("income")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      formType === "income"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    ↗ Pemasukan
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeChange("expense")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      formType === "expense"
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    ↘ Pengeluaran
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nominal
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    Rp
                  </span>

                  <input
                    id="amount"
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(event) =>
                      formatInputAmount(event.target.value)
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Kategori
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tanggal
                </label>

                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Catatan
                  <span className="ml-1 font-normal text-slate-400">
                    (opsional)
                  </span>
                </label>

                <input
                  id="note"
                  type="text"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Contoh: Gaji bulan September"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                    formType === "income"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {editingId ? "Simpan Perubahan" : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

