import Image from "next/image";
import { getMerchandiseItems, type MerchandiseItem } from "@/lib/queries";

const STATIC_PRODUCTS = [
  { id: 's1', foto_url: '/images/merch/merc-1.png', nama_produk: '[PREMIUM] Gua Hira Jacket Sajadah ESCAPE x Antarestar Special', kategori: 'Hoodie', harga: 'Rp 280.000' },
  { id: 's2', foto_url: '/images/merch/merc-2.png', nama_produk: '[PREMIUM] Lateral Orbit T-shirt ESCAPE x Antarestar Special Collaboration', kategori: 'T-shirt', harga: 'Rp 180.000' },
  { id: 's3', foto_url: '/images/merch/merc-3.png', nama_produk: '[PREMIUM] Second Coming Shirt Jacket ESCAPE x Antarestar Special', kategori: 'Outer', harga: 'Rp 230.000' },
  { id: 's4', foto_url: '/images/merch/merc-4.png', nama_produk: '[PREMIUM] Escape From Injustice Hoodie ESCAPE x Antarestar Special Collaboration', kategori: 'Hoodie', harga: 'Rp 380.000' },
  { id: 's5', foto_url: '/images/merch/merc-5.png', nama_produk: 'Totebag Vol.3', kategori: 'Merchandise', harga: 'Rp 80.000' },
  { id: 's6', foto_url: '/images/merch/merc-6.png', nama_produk: '[T-shirt Vol.2] Menjadi Manusia Sebelum Beragama', kategori: 'T-shirt', harga: 'Rp 180.000' },
];

export default async function MerchandiseSection() {
  const dbProducts = await getMerchandiseItems();
  const products = dbProducts.length > 0 ? dbProducts : STATIC_PRODUCTS;

  return (
    <section className="bg-black py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Escape Official Merchandise
          </h2>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            Jadi bagian dari Escape dengan membeli merchandise dan fashion dari Escape
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
          {products.map((product: MerchandiseItem) => (
            <div key={product.id} className="flex flex-col group">
              <div className="overflow-hidden rounded-2xl bg-white flex items-center justify-center aspect-3/4 p-6">
                {product.foto_url ? (
                  <Image
                    src={product.foto_url}
                    alt={product.nama_produk || ''}
                    width={400}
                    height={500}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                    <svg width="40" height="40" fill="none" stroke="#ccc" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-white md:text-base">{product.nama_produk || 'Nama produk'}</p>
                <p className="mt-0.5 text-xs text-gray-500 md:text-sm">{product.kategori || ''}</p>
                <p className="mt-2 text-lg font-bold text-white md:text-xl">{product.harga || ''}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 md:mt-16">
          <a
            href="https://shopee.co.id/escapeid"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-[#DA393C] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#b52b2d] active:scale-95 md:text-base"
          >
            Buy on Shopee
          </a>
          <a
            href="/merchandise"
            className="rounded-lg border border-white bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black active:scale-95 sm:px-8 sm:py-3 sm:text-base"
          >
            View All Catalogue
          </a>
        </div>

      </div>
    </section>
  );
}