import Image from "next/image";
import { InfiniteScrollGallery } from "../ui/infinite-gallery";
import { getHeroEventData, getEventDetailData } from "@/lib/queries";

export default async function Hero() {
  const [data, eventDetail] = await Promise.all([
    getHeroEventData('dashboard'),
    getEventDetailData(),
  ]);

  const bgUrl = data?.background_photo_url || '/images/hero3.png';
  const mobileBgUrl = eventDetail?.poster_event_url || bgUrl;
  const pngUrl = data?.png_image_url || null;
  const button1Text = data?.button1_text || 'Buy Ticket';
  const button1Url = data?.button1_url || 'https://drsn.me/escapemakassar2026';
  const button2Text = data?.button2_text || 'Check Details';
  const button2Url = data?.button2_url || '/offline';

  return (
    <section className="relative bg-black">
      <div className="relative mx-auto flex w-full flex-col">
        <div className="relative w-full mb-10 aspect-3/4 sm:aspect-4/3 md:aspect-1440/900">
          {/* Mobile: event detail poster as background. Lazy + hidden on >=sm so
              only the breakpoint-appropriate image is downloaded. */}
          <Image
            src={mobileBgUrl}
            alt=""
            fill
            sizes="100vw"
            className="z-0 object-cover object-center sm:hidden"
            aria-hidden
          />
          {/* Tablet/desktop: hero background photo */}
          <Image
            src={bgUrl}
            alt=""
            fill
            sizes="100vw"
            className="z-0 hidden object-cover object-center sm:block"
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-end lg:pb-6">
            {pngUrl && (
              <Image
                src={pngUrl}
                alt=""
                width={400}
                height={200}
                priority
                className="mb-4 w-48 object-contain sm:w-64 md:w-80 lg:w-100"
              />
            )}
            <div className="flex gap-4">
              <a
                href={button1Url}
                className="rounded-lg border border-black bg-[#DA393C] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#b52b2d] active:scale-95 sm:px-8 sm:py-3 sm:text-base"
              >
                {button1Text}
              </a>
              <a
                href={button2Url}
                className="rounded-lg border border-white bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black active:scale-95 sm:px-8 sm:py-3 sm:text-base"
              >
                {button2Text}
              </a>
            </div>
          </div>
        </div>

        <div className="w-full py-4">
          <InfiniteScrollGallery />
        </div>
      </div>
    </section>
  );
}