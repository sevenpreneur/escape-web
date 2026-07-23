import Image from "next/image";
import { getEventDetailData } from "@/lib/queries";

export default async function EventDetailSection() {
  const data = await getEventDetailData();

  const posterUrl = data?.poster_event_url || '/images/event.png';
  const judulEvent = data?.judul_event || 'BALAI MANUNGGAL';
  const deskripsi = data?.deskripsi || 'Escape Room Live hadir di Balai Manunggal, Makassar — venue megah yang siap menjadi saksi percakapan paling berkesan tahun ini. Cek jadwal, pilih kursimu, dan bersiaplah untuk hadir langsung.';
  const lokasi = data?.lokasi || 'Balai M Yusuf';
  const tanggal = data?.tanggal || 'Sunday, 3 May 2026';
  const waktu = data?.waktu || '13:00 - 17:00 WITA';
  const kapasitas = data?.kapasitas || '1000+';
  const teksButton = data?.teks_button || 'Buy Now!';
  const urlButton = data?.url_button || 'https://drsn.me/escapemakassar2026';

  return (
    <section id="detail" className="bg-black py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">

          {/* Left Column — Event Poster */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md lg:max-w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
              <Image
                src={posterUrl}
                alt={judulEvent}
                width={660}
                height={680}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Column — Event Info */}
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-4xl font-extrabold uppercase tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl leading-none">
                {judulEvent}
              </h2>
            </div>

            <p className="text-base font-medium text-gray-300 md:text-lg">
              {lokasi}
            </p>

            {deskripsi && (
              <p className="text-sm leading-relaxed text-gray-300 md:text-base max-w-lg">
                {deskripsi}
              </p>
            )}

            <div className="w-full border-t border-white/10" />

            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-sm text-white md:text-base">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </span>
                <span className="font-medium">{tanggal}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white md:text-base">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <span className="font-medium">{waktu}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white md:text-base">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <span className="font-medium">{kapasitas} Capacity</span>
              </li>
            </ul>

            <div className="mt-2">
              <a
                href={urlButton}
                className="inline-flex items-center justify-center rounded-xl bg-[#DA393C] px-10 py-4 text-sm font-bold tracking-widest text-white shadow-lg shadow-[#DA393C]/30 transition-all duration-200 hover:bg-[#b52b2d] active:scale-95 md:text-base"
              >
                {teksButton}
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}