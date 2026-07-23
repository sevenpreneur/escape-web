import Image from "next/image";
import { getPromotionalBannerData } from "@/lib/queries";

export default async function SpotifySection() {
  const data = await getPromotionalBannerData();

  const fotoUrl = data?.foto_url || '/images/spo.png';
  const headline = data?.headline || 'ESCAPE SEKARANG TERSEDIA DI SPOTIFY!';
  const deskripsi = data?.deskripsi || 'Kabar gembira! Diskusi lateral thinking bareng Raymond, Ustadz Felix, Koi, dan Veren kini bisa kamu akses kapan saja di Spotify. Follow sekarang agar tak ketinggalan episode terbarunya!';
  const teksButton = data?.teks_button || 'Dengarkan Sekarang!';
  const urlButton = data?.url_button || 'https://open.spotify.com/show/1sXjtHpEBqgAlb1ezODV91';

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-8 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          <div className="flex justify-center lg:justify-start">
            <Image
              src={fotoUrl}
              alt="Escape on Spotify"
              width={600}
              height={640}
              className="w-full max-w-sm sm:max-w-md lg:max-w-full h-auto rounded-2xl"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1DB954]">
              <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>

            <h2 className="text-3xl font-extrabold uppercase leading-tight text-white md:text-4xl lg:text-5xl">
              {headline}
            </h2>

            {deskripsi && (
              <p className="text-sm leading-relaxed text-gray-400 md:text-base max-w-lg">
                {deskripsi}
              </p>
            )}

            <div>
              <a
                href={urlButton}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#1DB954] px-8 py-4 text-sm font-bold text-black transition-all duration-200 hover:bg-[#17a349] active:scale-95"
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