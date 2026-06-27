import Image from "next/image";
import { getHeroEventData } from "@/lib/supabase-server";

export default async function OnlineHero() {
  const data = await getHeroEventData('online');

  const bgUrl = data?.background_photo_url || '/images/hero2.png';
  const teksLogo = data?.teks_logo || 'escape';
  const teksJudul = data?.teks_judul || 'ESCAPE 2.0';
  const teksDetail = data?.teks_detail || 'IS OUT! WATCH NOW ON YOUTUBE!';
  const button1Text = data?.button1_text || 'Watch Now!';
  const button1Url = data?.button1_url || 'https://youtu.be/-HTgSYyIE-U?si=6ZjBCHWOCSFb_2Bu';
  const button2Text = data?.button2_text || 'Season 1';
  const button2Url = data?.button2_url || 'https://youtube.com/playlist?list=PLSNt1tjjz_ArTDv1jVMjhHlaHM51euDq0&si=OqVnRwGtmnPrz-S5';

  return (
    <section className="relative bg-black overflow-hidden" style={{ minHeight: 0 }}>
      <div className="relative w-full aspect-video md:max-h-screen">
        <Image
          src={bgUrl}
          alt={teksJudul}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black to-transparent" />

        {/* Desktop/tablet only content overlay */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-10 pb-10 lg:pb-16">
          <div className="mx-auto max-w-7xl px-8 lg:px-16">
            <div className="grid grid-cols-2 gap-12 items-end">
              <div className="flex flex-col gap-2">
                <Image
                  src="/images/escape.png"
                  alt="escape"
                  width={110}
                  height={32}
                  className="w-20 opacity-90 mb-1"
                />
                <h1 className="text-5xl font-black uppercase leading-none text-white lg:text-7xl xl:text-8xl">
                  {teksJudul}
                </h1>
                <p className="text-xs font-bold uppercase tracking-widest text-white">
                  {teksDetail}
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a
                    href={button1Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-[#DA393C] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#b52b2d] active:scale-95"
                  >
                    {button1Text}
                  </a>
                  {button2Text && (
                    <a
                      href={button2Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg border border-white/60 bg-transparent px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-105 hover:bg-white/10 active:scale-95"
                    >
                      {button2Text}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 max-w-sm lg:max-w-md ml-auto">
                <h2 className="text-sm font-bold leading-snug text-white lg:text-lg">
                  Starring Raymond Chin, Felix Siauw, Koiyo Cabe, Verren Ornela
                </h2>
                <p className="text-xs leading-relaxed text-gray-300 md:text-sm">
                  Siap-siap ngabuburit beda dari biasanya! Raymond, Ustadz Felix, Koi, dan Veren hadir kembali untuk menantang cara berpikirmu. Lewat konsep lateral thinking, kita bakal bedah tuntas makna spiritualitas dari sudut pandang yang lebih dalam dan tak terduga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile only */}
      <div className="md:hidden bg-black px-8 py-6">
        <Image src="/images/escape.png" alt="escape" width={110} height={32} className="w-16 opacity-90 mb-3" />
        <h1 className="text-4xl font-black uppercase leading-none text-white mb-1">{teksJudul}</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">{teksDetail}</p>
        <div className="flex flex-wrap gap-3 mb-6">
          <a href={button1Url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-[#DA393C] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#b52b2d] active:scale-95">
            {button1Text}
          </a>
          {button2Text && (
            <a href={button2Url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/60 bg-transparent px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-white/10 active:scale-95">
              {button2Text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}