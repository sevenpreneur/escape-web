import Image from "next/image";
import { getPlaylistItems, type PlaylistItem } from "@/lib/supabase-server";

export const dynamic = 'force-dynamic'; 

const STATIC_EPISODES = [
  { id: 's1', thumbnail_url: '/images/playlist/pl-1.png', category: 'Online Podcast', duration: '17+ Hours', nama_playlist: 'ESCAPE SEASON 2 (2026)', deskripsi: 'Siapa disini yang kangen dengan Escape?! yuk tonton season terbaru dari Escape!', youtube_playlist_id: 'PLSNt1tjjz_ArbAOmvUSXCAyUaksGy0lDs' },
  { id: 's2', thumbnail_url: '/images/playlist/pl-2.png', category: 'Youtube Video', duration: '45 min', nama_playlist: 'ESCAPE HIGHLIGHTS', deskripsi: 'Tonton video tunggal terbaru kami di Youtube.', youtube_playlist_id: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { id: 's3', thumbnail_url: '/images/playlist/pl-3.png', category: 'Spotify Podcast', duration: '60 min', nama_playlist: 'ESCAPE DI SPOTIFY', deskripsi: 'Dengerin obrolan seru kami sambil di jalan raya!', youtube_playlist_id: 'https://open.spotify.com/episode/123456789' },
];

export default async function PlaylistSection() {
  const dbItems = await getPlaylistItems();
  const episodes = dbItems.length > 0 ? dbItems : STATIC_EPISODES;

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-8 lg:px-16">
        <h2 className="mb-12 text-3xl font-light text-white md:text-4xl lg:text-5xl md:mb-16">
          Jangan lewatkan Escape lainnya!
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-12 md:gap-y-12 lg:gap-x-16 lg:gap-y-14">
          {episodes.map((ep: PlaylistItem) => {
            
            // --- SMART LINK PARSER ---
            let href = '#';
            let ctaText = 'Check it out!';
            const linkData = ep.youtube_playlist_id || '';

            if (linkData) {
              // 1. If it starts with HTTP, it's a direct URL (Spotify, Youtube Video, etc.)
              if (linkData.startsWith('http')) {
                href = linkData;
                
                if (linkData.includes('spotify.com')) {
                  ctaText = 'Listen on Spotify';
                } else if (linkData.includes('youtube.com/watch') || linkData.includes('youtu.be')) {
                  ctaText = 'Watch Video';
                } else {
                  ctaText = 'Visit Link';
                }
              } 
              // 2. Otherwise, it's an old legacy YouTube Playlist ID
              else {
                href = `https://www.youtube.com/playlist?list=${linkData}`;
                ctaText = 'Watch Playlist';
              }
            }

            return (
              <a
                key={ep.id}
                href={href}
                target={href !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex gap-5 items-start"
              >
                <div className="shrink-0 w-36 sm:w-44 md:w-40 lg:w-44 xl:w-48 aspect-square overflow-hidden rounded-2xl bg-gray-900">
                  {ep.thumbnail_url ? (
                    <Image
                      src={ep.thumbnail_url}
                      alt={ep.nama_playlist || ''}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <svg width="32" height="32" fill="none" stroke="#555" strokeWidth="1.5" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2.5 pt-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="border border-white bg-white px-2.5 py-1 text-xs font-semibold text-black">
                      {ep.category || 'Podcast'}
                    </span>
                    {ep.duration && (
                      <span className="px-2.5 py-1 text-xs font-semibold text-white">
                        {ep.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold uppercase text-white md:text-lg leading-tight">
                    {ep.nama_playlist}
                  </h3>

                  {ep.deskripsi && (
                    <p className="text-xs leading-relaxed text-gray-400 md:text-sm line-clamp-3">
                      {ep.deskripsi}
                    </p>
                  )}

                  <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white transition-opacity group-hover:opacity-70">
                    {ctaText}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}