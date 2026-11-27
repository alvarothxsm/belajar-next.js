"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type Product,
  type Transaction,
  type InitialCapital,
  getProducts,
  addProduct,
  markProductAsSold,
  getTransactions,
  addExpense,
  getInitialCapitals,
  addInitialCapital,
} from "@/lib/finance";

function formatRupiah(amount: number): string {
  return "Rp " + Number(amount || 0).toLocaleString("id-ID");
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function FinanceDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [capitals, setCapitals] = useState<InitialCapital[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

  // Form Barang Limited
  const [prodName, setProdName] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("1");

  // Form Pengeluaran
  const [expCategory, setExpCategory] = useState("Packaging");
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState("");

  // Form Modal Awal
  const [capCategory, setCapCategory] = useState("Uang Tunai");
  const [capDesc, setCapDesc] = useState("");
  const [capAmount, setCapAmount] = useState("");

  async function loadAllData() {
    try {
      setErrorMsg("");
      const [p, t, c] = await Promise.all([
        getProducts(),
        getTransactions(),
        getInitialCapitals(),
      ]);
      setProducts(p);
      setTransactions(t);
      setCapitals(c);
    } catch (err) {
      setErrorMsg((err as { message?: string })?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  const monthOptions = useMemo(() => {
    const months = new Set<string>([getCurrentMonth()]);
    transactions.forEach((t) => {
      if (t.transaction_date) {
        months.add(t.transaction_date.slice(0, 7));
      }
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (selectedMonth === "ALL") return transactions;
    return transactions.filter((t) => t.transaction_date?.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const totalModalAwal = capitals.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalPemasukan = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const totalPengeluaran = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const labaKotor = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.profit), 0);
  const labaBersih = labaKotor - totalPengeluaran;

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!prodName.trim() || !sellPrice) return;
    try {
      await addProduct(
        prodName.trim(),
        Number(buyPrice || 0),
        Number(sellPrice),
        Number(stock || 1)
      );
      setProdName("");
      setBuyPrice("");
      setSellPrice("");
      setStock("1");
      await loadAllData();
    } catch (err) {
      setErrorMsg((err as { message?: string })?.message || "Gagal menambah barang");
    }
  }

  async function handleSold(product: Product) {
    try {
      await markProductAsSold(product);
      await loadAllData();
    } catch (err) {
      setErrorMsg((err as { message?: string })?.message || "Gagal konfirmasi terjual");
    }
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;
    try {
      await addExpense(expCategory, expTitle.trim(), Number(expAmount));
      setExpTitle("");
      setExpAmount("");
      await loadAllData();
    } catch (err) {
      setErrorMsg((err as { message?: string })?.message || "Gagal mencatat pengeluaran");
    }
  }

  async function handleAddCapital(e: React.FormEvent) {
    e.preventDefault();
    if (!capAmount) return;
    try {
      await addInitialCapital(capCategory, capDesc.trim(), Number(capAmount));
      setCapDesc("");
      setCapAmount("");
      await loadAllData();
    } catch (err) {
      setErrorMsg((err as { message?: string })?.message || "Gagal menyimpan modal awal");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #27272a",
    backgroundColor: "#141418",
    color: "#f4f4f5",
    fontSize: 14,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#111115",
    border: "1px solid #222229",
    borderRadius: 12,
    padding: 16,
  };

  const btnPrimary: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#f4f4f5",
    color: "#09090b",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#09090b",
        color: "#f4f4f5",
        padding: "28px 18px 64px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: "1px solid #1e1e24",
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            Manajemen Keuangan &amp; Stok Limited
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label htmlFor="bulanFilter" style={{ fontSize: 13, color: "#a1a1aa" }}>
              Bulan:
            </label>
            <select
              id="bulanFilter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ ...inputStyle, width: "auto", padding: "8px 12px" }}
            >
              <option value="ALL">Semua Waktu</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </header>

        {errorMsg && (
          <p
            style={{
              color: "#fca5a5",
              backgroundColor: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.35)",
              padding: "10px 14px",
              borderRadius: 8,
              marginBottom: 18,
            }}
          >
            Error: {errorMsg}
          </p>
        )}

        {/* RINGKASAN KEUANGAN & LABA */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={cardStyle}>
            <small style={{ color: "#a1a1aa" }}>Modal Awal</small>
            <h3 style={{ fontSize: 20, margin: "6px 0 0" }}>{formatRupiah(totalModalAwal)}</h3>
          </div>
          <div style={cardStyle}>
            <small style={{ color: "#a1a1aa" }}>Total Pemasukan</small>
            <h3 style={{ fontSize: 20, margin: "6px 0 0", color: "#60a5fa" }}>
              {formatRupiah(totalPemasukan)}
            </h3>
          </div>
          <div style={cardStyle}>
            <small style={{ color: "#a1a1aa" }}>Total Pengeluaran</small>
            <h3 style={{ fontSize: 20, margin: "6px 0 0", color: "#f87171" }}>
              {formatRupiah(totalPengeluaran)}
            </h3>
          </div>
          <div style={cardStyle}>
            <small style={{ color: "#a1a1aa" }}>Laba Kotor</small>
            <h3 style={{ fontSize: 20, margin: "6px 0 0" }}>{formatRupiah(labaKotor)}</h3>
          </div>
          <div
            style={{
              ...cardStyle,
              borderColor: labaBersih >= 0 ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)",
            }}
          >
            <small style={{ color: "#a1a1aa" }}>Laba Bersih</small>
            <h3
              style={{
                fontSize: 20,
                margin: "6px 0 0",
                color: labaBersih >= 0 ? "#4ade80" : "#f87171",
              }}
            >
              {formatRupiah(labaBersih)}
            </h3>
          </div>
        </section>

        {/* FORM INPUT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <form
            onSubmit={handleAddProduct}
            style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 10 }}
          >
            <h3 style={{ margin: 0, fontSize: 16 }}>+ Tambah Barang Limited</h3>
            <input
              style={inputStyle}
              placeholder="Nama barang"
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              required
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Harga modal / beli (Rp)"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              required
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Harga jual (Rp)"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              required
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Stok (default 1)"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min={1}
              required
            />
            <button type="submit" style={btnPrimary}>
              Simpan Barang
            </button>
          </form>

          <form
            onSubmit={handleAddExpense}
            style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 10 }}
          >
            <h3 style={{ margin: 0, fontSize: 16 }}>- Catat Pengeluaran</h3>
            <select
              style={inputStyle}
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value)}
            >
              <option value="Modal Stok">Modal Stok</option>
              <option value="Transportasi">Transportasi</option>
              <option value="Packaging">Packaging</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <input
              style={inputStyle}
              placeholder="Keterangan (misal: Plastik polymailer)"
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              required
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Nominal (Rp)"
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              required
            />
            <button type="submit" style={{ ...btnPrimary, marginTop: "auto" }}>
              Catat Pengeluaran
            </button>
          </form>

          <form
            onSubmit={handleAddCapital}
            style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 10 }}
          >
            <h3 style={{ margin: 0, fontSize: 16 }}>+ Catat Modal Awal</h3>
            <select
              style={inputStyle}
              value={capCategory}
              onChange={(e) => setCapCategory(e.target.value)}
            >
              <option value="Uang Tunai">Uang Tunai</option>
              <option value="Peralatan">Peralatan</option>
              <option value="Stok Awal">Stok Awal</option>
            </select>
            <input
              style={inputStyle}
              placeholder="Keterangan modal"
              value={capDesc}
              onChange={(e) => setCapDesc(e.target.value)}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Nominal (Rp)"
              value={capAmount}
              onChange={(e) => setCapAmount(e.target.value)}
              required
            />
            <button type="submit" style={{ ...btnPrimary, marginTop: "auto" }}>
              Simpan Modal
            </button>
          </form>
        </div>

        {/* STOK BARANG */}
        <section style={{ ...cardStyle, marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, margin: "0 0 14px" }}>
            Stok Barang (Klik Terjual Otomatis Data Pemasukan)
          </h2>
          {loading ? (
            <p style={{ color: "#a1a1aa" }}>Memuat data...</p>
          ) : products.length === 0 ? (
            <p style={{ color: "#a1a1aa" }}>Belum ada barang.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #27272a", color: "#a1a1aa", textAlign: "left" }}>
                    <th style={{ padding: "10px 8px" }}>Nama Barang</th>
                    <th style={{ padding: "10px 8px" }}>Modal</th>
                    <th style={{ padding: "10px 8px" }}>Harga Jual</th>
                    <th style={{ padding: "10px 8px" }}>Stok</th>
                    <th style={{ padding: "10px 8px" }}>Status</th>
                    <th style={{ padding: "10px 8px", textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => {
                    const soldOut = item.stock <= 0 || item.status === "sold";
                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid #19191f" }}>
                        <td style={{ padding: "11px 8px", fontWeight: 500 }}>{item.name}</td>
                        <td style={{ padding: "11px 8px", color: "#a1a1aa" }}>
                          {formatRupiah(Number(item.buy_price))}
                        </td>
                        <td style={{ padding: "11px 8px", fontWeight: 600 }}>
                          {formatRupiah(Number(item.sell_price))}
                        </td>
                        <td style={{ padding: "11px 8px" }}>{item.stock}</td>
                        <td style={{ padding: "11px 8px" }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "3px 8px",
                              borderRadius: 999,
                              backgroundColor: soldOut
                                ? "rgba(244,63,94,0.14)"
                                : "rgba(34,197,94,0.14)",
                              color: soldOut ? "#fb7185" : "#4ade80",
                            }}
                          >
                            {soldOut ? "SOLD OUT" : "Tersedia"}
                          </span>
                        </td>
                        <td style={{ padding: "11px 8px", textAlign: "right" }}>
                          <button
                            disabled={soldOut}
                            onClick={() => handleSold(item)}
                            style={{
                              padding: "7px 12px",
                              borderRadius: 7,
                              border: "none",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: soldOut ? "not-allowed" : "pointer",
                              opacity: soldOut ? 0.45 : 1,
                              backgroundColor: soldOut ? "#27272a" : "#22c55e",
                              color: soldOut ? "#a1a1aa" : "#052e16",
                            }}
                          >
                            {soldOut ? "Sudah Terjual" : "Konfirmasi Terjual"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RIWAYAT TRANSAKSI */}
        <section style={cardStyle}>
          <h2 style={{ fontSize: 18, margin: "0 0 14px" }}>
            Riwayat Pemasukan &amp; Pengeluaran
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #27272a", color: "#a1a1aa", textAlign: "left" }}>
                  <th style={{ padding: "10px 8px" }}>Tanggal</th>
                  <th style={{ padding: "10px 8px" }}>Jenis</th>
                  <th style={{ padding: "10px 8px" }}>Kategori</th>
                  <th style={{ padding: "10px 8px" }}>Keterangan</th>
                  <th style={{ padding: "10px 8px" }}>Nominal</th>
                  <th style={{ padding: "10px 8px", textAlign: "right" }}>Laba Kotor</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: "1px solid #19191f" }}>
                    <td style={{ padding: "11px 8px", color: "#a1a1aa" }}>{tx.transaction_date}</td>
                    <td style={{ padding: "11px 8px" }}>
                      {tx.type === "income" ? "Pemasukan" : "Pengeluaran"}
                    </td>
                    <td style={{ padding: "11px 8px" }}>{tx.category}</td>
                    <td style={{ padding: "11px 8px" }}>{tx.title}</td>
                    <td style={{ padding: "11px 8px", fontWeight: 600 }}>
                      {formatRupiah(Number(tx.amount))}
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        textAlign: "right",
                        color: tx.type === "income" ? "#4ade80" : "#a1a1aa",
                      }}
                    >
                      {tx.type === "income" ? formatRupiah(Number(tx.profit)) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
