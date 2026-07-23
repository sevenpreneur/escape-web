import Image from "next/image";
import { getMerchandiseItems, type MerchandiseItem } from "@/lib/queries";

export const dynamic = 'force-dynamic';

const STATIC_ARRIVALS = [
    { nama_produk: "Jaket Sajadah (Jajadah)", kategori: "Outer", harga: "Rp 470.000", foto_url: "/images/merch/merc-1.png" },
    { nama_produk: "T-Shirt Vol.3", kategori: "T-shirt", harga: "Rp 189.000", foto_url: "/images/merch/merc-2.png" },
    { nama_produk: 'Shirt Jacket - The Second Coming', kategori: "Outer", harga: "Rp 289.000", foto_url: "/images/merch/merc-3.png" },
    { nama_produk: "Hoodie Vol.3", kategori: "Hoodie", harga: "Rp 350.000", foto_url: "/images/merch/merc-4.png" },
];

export default async function NewArrivals() {
    const allDbProducts = await getMerchandiseItems();
    
    // 1. Find the highest "Vol.X" number in the database
    let maxVol = 3; // We start at 3 as our default baseline
    
    const volumeNumbers = allDbProducts
        .map((p: MerchandiseItem) => {
            // This regex looks for "vol." followed by numbers (e.g., "vol.3", "vol.4")
            const match = (p.nama_produk || '').toLowerCase().match(/vol\.(\d+)/);
            return match ? parseInt(match[1], 10) : null;
        })
        .filter((num): num is number => num !== null); // Remove nulls

    if (volumeNumbers.length > 0) {
        maxVol = Math.max(...volumeNumbers); // Get the highest number found
    }

    // 2. Filter products to ONLY show items from the highest volume
    const dbArrivals = allDbProducts.filter((p: MerchandiseItem) => {
        const name = (p.nama_produk || '').toLowerCase();
        
        // Special rule: if the highest volume is still 3, include your specific legacy items
        if (maxVol === 3) {
            return name.includes('vol.3') || name.includes('sajadah') || name.includes('second coming');
        }
        
        // Otherwise, just look for the highest volume number (e.g., "vol.4", "vol.5")
        return name.includes(`vol.${maxVol}`);
    });
    
    const products = dbArrivals.length > 0 ? dbArrivals : STATIC_ARRIVALS;

    return (
        <section className="bg-black py-16 md:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* 3. The Title updates dynamically based on the highest volume! */}
                <h2 className="mb-10 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                    New Arrivals - Vol.{maxVol}
                </h2>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {products.map((product: MerchandiseItem, index: number) => (
                        <div key={product.id || index} className="flex flex-col group cursor-pointer">
                            <div className="overflow-hidden rounded-2xl bg-white flex items-center justify-center aspect-square p-4 sm:p-8 md:p-12">
                                <Image
                                    src={product.foto_url}
                                    alt={product.nama_produk || ''}
                                    width={500}
                                    height={500}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm font-semibold text-white sm:text-base">
                                    {product.nama_produk}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                                    {product.kategori}
                                </p>
                                <p className="mt-2 text-base font-bold text-white sm:text-lg">
                                    {product.harga}
                                </p>
                            </div>
                        </div>
                    ))}
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
            </div>
        </section>
    );
}