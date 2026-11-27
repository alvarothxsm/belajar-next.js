type ProductCardProps = {
    nama: string;
    harga: number;
    kondisi: "New" | "Preloved";
    stok: number;
};

export default function ProductCard({ nama, harga, kondisi, stok }: ProductCardProps) {
    const habis = stok === 0;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                Foto Produk
            </div>

            <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${kondisi === "New"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
            >
                {kondisi}
            </span>

            <h3 className="mt-2 font-semibold text-gray-900">{nama}</h3>
            <p className="text-lg font-bold text-gray-900">
                Rp {harga.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500">
                {habis ? "Stok habis" : `Sisa stok: ${stok}`}
            </p>

            <button
                disabled={habis}
                className="mt-3 w-full rounded-lg bg-black py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
                {habis ? "Habis" : "Beli"}
            </button>
        </div>
    );
}