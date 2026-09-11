
"use client";

import { useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  qty: number;
  price: number;
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const getToday = () => new Date().toISOString().split("T")[0];

const formatDate = (date: string) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

export default function InvoicePage() {
  const [businessName, setBusinessName] = useState("Nama Bisnis Anda");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
  );

  const [invoiceDate, setInvoiceDate] = useState(getToday());
  const [dueDate, setDueDate] = useState("");

  const [items, setItems] = useState<Item[]>([
    {
      id: Date.now(),
      name: "",
      qty: 1,
      price: 0,
    },
  ]);

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [note, setNote] = useState("");

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + Math.max(0, item.qty) * Math.max(0, item.price),
        0
      ),
    [items]
  );

  const discountAmount = Math.min(
    subtotal,
    Math.max(0, subtotal * (discount / 100))
  );

  const afterDiscount = subtotal - discountAmount;
  const taxAmount = Math.max(0, afterDiscount * (tax / 100));
  const grandTotal = afterDiscount + taxAmount;

  const updateItem = (
    id: number,
    field: keyof Omit<Item, "id">,
    value: string | number
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "qty" || field === "price"
                  ? Math.max(0, Number(value) || 0)
                  : value,
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        id: Date.now() + Math.random(),
        name: "",
        qty: 1,
        price: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) return;

    setItems((current) => current.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              🧾 Tool Gratis Urusin
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Buat Invoice Online
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Buat invoice profesional dengan mudah, lalu cetak atau simpan
              sebagai PDF tanpa perlu login.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_1fr] sm:px-6">
        {/* Form */}
        <div className="space-y-6 print:hidden">
          {/* Business */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Informasi Bisnis</h2>
            <p className="mt-1 text-sm text-slate-500">
              Masukkan informasi usaha atau jasa Anda.
            </p>

            <div className="mt-5 space-y-4">
              <Field
                label="Nama bisnis"
                value={businessName}
                onChange={setBusinessName}
                placeholder="Contoh: Urusin Studio"
              />

              <Field
                label="Alamat"
                value={businessAddress}
                onChange={setBusinessAddress}
                placeholder="Alamat bisnis"
              />

              <Field
                label="No. HP / WhatsApp"
                value={businessPhone}
                onChange={setBusinessPhone}
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Informasi Pelanggan</h2>

            <div className="mt-5 space-y-4">
              <Field
                label="Nama pelanggan"
                value={customerName}
                onChange={setCustomerName}
                placeholder="Nama pelanggan"
              />

              <Field
                label="Alamat pelanggan"
                value={customerAddress}
                onChange={setCustomerAddress}
                placeholder="Alamat pelanggan"
              />
            </div>
          </div>

          {/* Invoice */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Detail Invoice</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Nomor invoice"
                value={invoiceNumber}
                onChange={setInvoiceNumber}
                placeholder="INV-001"
              />

              <Field
                label="Tanggal invoice"
                type="date"
                value={invoiceDate}
                onChange={setInvoiceDate}
              />

              <Field
                label="Jatuh tempo"
                type="date"
                value={dueDate}
                onChange={setDueDate}
              />
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Daftar Barang / Jasa</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tambahkan produk atau layanan yang ditagihkan.
                </p>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                + Tambah
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Item {index + 1}
                    </span>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_100px_150px]">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      placeholder="Nama barang / jasa"
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(item.id, "qty", e.target.value)
                      }
                      placeholder="Qty"
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <input
                      type="number"
                      min="0"
                      value={item.price || ""}
                      onChange={(e) =>
                        updateItem(item.id, "price", e.target.value)
                      }
                      placeholder="Harga"
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount & Tax */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Diskon & Pajak</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Diskon (%)"
                type="number"
                value={String(discount)}
                onChange={(value) =>
                  setDiscount(Math.min(100, Math.max(0, Number(value) || 0)))
                }
                placeholder="0"
              />

              <Field
                label="Pajak (%)"
                type="number"
                value={String(tax)}
                onChange={(value) =>
                  setTax(Math.min(100, Math.max(0, Number(value) || 0)))
                }
                placeholder="0"
              />
            </div>
          </div>

          {/* Note */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Catatan</h2>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Contoh: Terima kasih atas kepercayaan Anda."
              className="mt-4 w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
            <div>
              <h2 className="text-lg font-bold">Preview Invoice</h2>
              <p className="text-sm text-slate-500">
                Pastikan data sudah benar sebelum disimpan.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              🖨️ Simpan PDF
            </button>
          </div>

          <div
            id="invoice-preview"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none"
          >
            {/* Invoice header */}
            <div className="border-b border-slate-200 p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row">
                <div>
                  <div className="text-2xl font-bold tracking-tight text-slate-900">
                    {businessName || "Nama Bisnis Anda"}
                  </div>

                  {businessAddress && (
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                      {businessAddress}
                    </p>
                  )}

                  {businessPhone && (
                    <p className="mt-1 text-sm text-slate-500">
                      {businessPhone}
                    </p>
                  )}
                </div>

                <div className="sm:text-right">
                  <div className="text-3xl font-bold tracking-tight text-blue-600">
                    INVOICE
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {invoiceNumber || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer + dates */}
            <div className="grid gap-6 border-b border-slate-200 p-6 sm:grid-cols-2 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Ditagihkan kepada
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {customerName || "Nama pelanggan"}
                </p>

                {customerAddress && (
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-500">
                    {customerAddress}
                  </p>
                )}
              </div>

              <div className="sm:text-right">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tanggal
                  </span>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(invoiceDate)}
                  </p>
                </div>

                {dueDate && (
                  <div className="mt-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Jatuh tempo
                    </span>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(dueDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="p-6 sm:p-8">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-4 py-3 font-semibold text-slate-600">
                        Deskripsi
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-600">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-600">
                        Harga
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-600">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-t border-slate-200">
                        <td className="px-4 py-4 text-slate-800">
                          {item.name || "Nama barang / jasa"}
                        </td>

                        <td className="px-4 py-4 text-center text-slate-600">
                          {item.qty}
                        </td>

                        <td className="px-4 py-4 text-right text-slate-600">
                          {formatRupiah(item.price)}
                        </td>

                        <td className="px-4 py-4 text-right font-medium text-slate-800">
                          {formatRupiah(item.qty * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 flex justify-end">
                <div className="w-full max-w-sm space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between gap-4 text-red-600">
                      <span>Diskon ({discount}%)</span>
                      <span>-{formatRupiah(discountAmount)}</span>
                    </div>
                  )}

                  {tax > 0 && (
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Pajak ({tax}%)
                      </span>
                      <span>{formatRupiah(taxAmount)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-end justify-between gap-4">
                      <span className="font-bold text-slate-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-blue-600">
                        {formatRupiah(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              {note && (
                <div className="mt-8 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Catatan
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {note}
                  </p>
                </div>
              )}

              <div className="mt-10 border-t border-slate-200 pt-5 text-center">
                <p className="text-xs text-slate-400">
                  Dibuat dengan Urusin — Biar urusanmu beres.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="border-t bg-white print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold">
              Buat Invoice Online Gratis
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Urusin membantu Anda membuat invoice sederhana dan profesional
              untuk kebutuhan bisnis, freelance, jasa, dan UMKM. Masukkan
              informasi bisnis, pelanggan, barang atau jasa, lalu cetak atau
              simpan invoice sebagai PDF.
            </p>

            <h3 className="mt-8 text-lg font-bold">
              Cara membuat invoice
            </h3>

            <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
              <li>Masukkan nama dan informasi bisnis.</li>
              <li>Masukkan nama pelanggan dan detail invoice.</li>
              <li>Tambahkan barang atau jasa yang ditagihkan.</li>
              <li>Atur diskon atau pajak jika diperlukan.</li>
              <li>Klik Simpan PDF untuk mencetak atau menyimpan invoice.</li>
            </ol>

            <h3 className="mt-8 text-lg font-bold">
              Cocok untuk freelancer dan UMKM
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Invoice dapat digunakan untuk berbagai kebutuhan seperti jasa
              desain, fotografi, konsultasi, servis, penjualan produk, dan
              pekerjaan freelance lainnya.
            </p>

            <h3 className="mt-8 text-lg font-bold">
              FAQ
            </h3>

            <div className="mt-4 space-y-5">
              <div>
                <h4 className="font-semibold">
                  Apakah invoice bisa disimpan sebagai PDF?
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Ya. Klik tombol Simpan PDF, lalu pilih opsi Save as PDF pada
                  jendela cetak browser.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">
                  Apakah perlu login?
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Tidak. Tool ini dapat digunakan langsung tanpa membuat akun.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">
                  Apakah bisa membuat beberapa barang atau jasa?
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Bisa. Klik tombol Tambah untuk menambahkan item sebanyak yang
                  diperlukan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-slate-50 print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
          © {new Date().getFullYear()} Urusin. Biar urusanmu beres.
        </div>
      </footer>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
          }

          #invoice-preview {
            width: 100% !important;
            max-width: none !important;
          }
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

