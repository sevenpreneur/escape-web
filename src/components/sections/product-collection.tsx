import Image from "next/image";
import { getMerchandiseItems, type MerchandiseItem } from "@/lib/queries";

export const dynamic = 'force-dynamic';

// 1. Group all static fallback data in one object for cleaner code
const STATIC_DATA: Record<number, MerchandiseItem[]> = {
    3: [
        { nama_produk: "Jaket Sajadah (Jajadah)", kategori: "Outer", harga: "Rp 470.000", foto_url: "/images/merch/merc-1.png" },
        { nama_produk: "T-Shirt Vol.3", kategori: "T-shirt", harga: "Rp 189.000", foto_url: "/images/merch/merc-2.png" },
        { nama_produk: 'Shirt Jacket - The Second Coming', kategori: "Outer", harga: "Rp 289.000", foto_url: "/images/merch/merc-3.png" },
        { nama_produk: "Hoodie Vol.3", kategori: "Hoodie", harga: "Rp 350.000", foto_url: "/images/merch/merc-4.png" },
    ],
    2: [
        { nama_produk: "T-shirt Vol.2", kategori: "T-shirt", harga: "Rp 189.000", foto_url: "/images/merch/merc-6.png" },
        { nama_produk: "Gelas Escape", kategori: "Merchandise", harga: "Sold Out", foto_url: "/images/merch/merc-12.png" },
        { nama_produk: "Pouch Canvas", kategori: "Merchandise", harga: "Sold Out", foto_url: "/images/merch/merc-8.png" },
        { nama_produk: "Escape: Unlearning - Lanyard", kategori: "Merchandise", harga: "Sold Out", foto_url: "/images/merch/merc-9.png" },
        { nama_produk: "Sticker Escape Vol.2", kategori: "Merchandise", harga: "Sold Out", foto_url: "/images/merch/merc-11.png" },
    ],
    1: [
        { nama_produk: "T-shirt Escape Vol.1", kategori: "T-shirt", harga: "Rp 189.000", foto_url: "/images/merch/merc-10.png" },
        { nama_produk: "Hoodie Escape Vol.1", kategori: "Hoodie", harga: "Rp 350.000", foto_url: "/images/merch/merc-7.png" },
        { nama_produk: "Escape Totebag Vol.1", kategori: "Merchandise", harga: "Rp 110.000", foto_url: "/images/merch/merc-13.png" },
    ]
};

function ProductCard({ product }: { product: MerchandiseItem }) {
    return (
        <div className="flex flex-col gap-3 group cursor-pointer">
            <div className="overflow-hidden rounded-2xl bg-white flex items-center justify-center p-4 sm:p-8 aspect-4/5">
                <Image
                    src={product.foto_url}
                    alt={product.nama_produk || ''}
                    width={500}
                    height={500}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-white">{product.nama_produk}</p>
                <p className="text-xs text-gray-500 mt-0.5">{product.kategori}</p>
                <p className="text-base font-bold text-white mt-2">{product.harga}</p>
            </div>
        </div>
    );
}

export default async function ProductCollection() {
    const allDbProducts = await getMerchandiseItems();
    
    // Create a map to hold items by their volume number
    const groupedVolumes = new Map<number, MerchandiseItem[]>();

    const assignToVolume = (vol: number, item: MerchandiseItem) => {
        if (!groupedVolumes.has(vol)) groupedVolumes.set(vol, []);
        groupedVolumes.get(vol)!.push(item);
    };

    // 2. Scan the database and assign every item to its volume
    allDbProducts.forEach((p: MerchandiseItem) => {
        const name = (p.nama_produk || '').toLowerCase();
        const volMatch = name.match(/vol\.(\d+)/);

        if (volMatch) {
            assignToVolume(parseInt(volMatch[1], 10), p);
        } else if (name.includes('sajadah') || name.includes('second coming')) {
            assignToVolume(3, p); // Legacy Vol 3 items
        } else if (name.includes('gelas') || name.includes('pouch') || name.includes('lanyard')) {
            assignToVolume(2, p); // Legacy Vol 2 items
        }
    });

    // 3. Fallback: If a volume has 0 items in the DB, inject the static data
    [1, 2, 3].forEach(vol => {
        if (!groupedVolumes.has(vol) || groupedVolumes.get(vol)!.length === 0) {
            STATIC_DATA[vol].forEach(p => assignToVolume(vol, p));
        }
    });

    // 4. Calculate the HIGHEST volume number
    const allVolumeNumbers = Array.from(groupedVolumes.keys());
    const maxVol = Math.max(...allVolumeNumbers, 3); // Ensures it's at least 3

    // 5. Exclude the max volume (because it's in New Arrivals) and sort the rest descending
    const catalogVolumes = allVolumeNumbers
        .filter(vol => vol < maxVol)
        .sort((a, b) => b - a);

    return (
        <section className="bg-black py-16 md:py-20 lg:py-24 px-6 lg:px-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-4 md:gap-6">

                {/* Dynamically render every volume that ISN'T the newest one */}
                {catalogVolumes.map((vol, index) => {
                    const products = groupedVolumes.get(vol) || [];
                    
                    return (
                        <div key={vol} className={index > 0 ? "mt-8 md:mt-12" : ""}>
                            <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl mb-4 md:mb-6">
                                Escape Vol.{vol}
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                                {products.map((product: MerchandiseItem, i: number) => (
                                    <ProductCard key={product.id || i} product={product} />
                                ))}
                            </div>
                        </div>
                    );
                })}

            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <a href="https://shopee.co.id/escapeid"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-[#DA393C] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#b52b2d] active:scale-95 md:text-base"
                >
                    Shop on Shopee
                </a>
            </div>
        </section>
    );
}