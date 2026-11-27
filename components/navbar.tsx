export default function Navbar() {
    return (
        <nav className="flex items-center justify-between bg-black p-4 text-white">
            <div className="text-lg font-bold">FK Shouthh</div>
            <ul className="flex space-x-6" >
                <li>beranda</li>
                <li>produk</li>
                <li>tentang</li>
                <li>kontak</li>
            </ul>
        </nav >
    )
}