import { supabase } from "./supabase";

// --- PRODUK & STOK LIMITED ---
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addProduct(name: string, buyPrice: number, sellPrice: number, stock: number) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      buy_price: buyPrice,
      sell_price: sellPrice,
      stock,
      status: stock > 0 ? "available" : "sold",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Konfirmasi Klik Terjual -> Stok berkurang & otomatis masuk Pemasukan
export async function markProductAsSold(product: {
  id: number;
  name: string;
  buy_price: number;
  sell_price: number;
  stock: number;
}) {
  const newStock = Math.max(0, product.stock - 1);
  const newStatus = newStock === 0 ? "sold" : "available";

  const { error: prodError } = await supabase
    .from("products")
    .update({ stock: newStock, status: newStatus })
    .eq("id", product.id);
  if (prodError) throw prodError;

  const grossProfit = product.sell_price - product.buy_price;
  const { error: txError } = await supabase
    .from("transactions")
    .insert({
      type: "income",
      category: "Penjualan",
      title: `Terjual: ${product.name}`,
      qty: 1,
      amount: product.sell_price,
      profit: grossProfit,
    });
  if (txError) throw txError;
}

// --- TRANSAKSI (PEMASUKAN & PENGELUARAN) ---
export async function getTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addExpense(category: string, title: string, amount: number) {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      type: "expense",
      category,
      title,
      qty: 1,
      amount,
      profit: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- MODAL AWAL ---
export async function getInitialCapitals() {
  const { data, error } = await supabase
    .from("initial_capital")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addInitialCapital(category: string, description: string, amount: number) {
  const { data, error } = await supabase
    .from("initial_capital")
    .insert({ category, description, amount })
    .select()
    .single();
  if (error) throw error;
  return data;
}
