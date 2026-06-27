import Image from "next/image";
import EscapeLogo from "@/components/icons/escape";

export default function MerchHero() {
    return (
        <section className="bg-black w-full">
            {/* Full-bleed hero image — no overlap */}
            <div className="relative w-full aspect-video max-h-[90vh]">
                <Image
                    src="/images/hero-merch.png"
                    alt="Escape Fashion & Merch"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-top"
                />
                
            </div>

            {/* Text block — fully below the image */}
            <div className="px-8 py-12 md:py-16 lg:px-16">
                <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

                    {/* Left — Logo + Headline + CTA */}
                    <div className="flex flex-col gap-4">
                        <EscapeLogo className="h-12 w-auto text-white opacity-90 self-start" />

                        <h1 className="text-3xl font-regular leading-tight text-white md:text-4xl lg:text-5xl">
                            Elevate your style with
                            <br />
                            Escape Fashion Merch!
                        </h1>

                        <div className="mt-2">
                            <a
                                href="https://shopee.co.id/escapeid"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg bg-[#DA393C] px-7 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#b52b2d] active:scale-95"
                            >
                                Cek Shopee Escape!
                            </a>
                        </div>
                    </div>

                    {/* Right — Description */}
                    <div className="md:pt-10">
                        <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                            Tingkatkan tidak hanya gayamu, tapi juga frekuensi jiwamu. Setiap koleksi Escape dirancang dengan intensi untuk menyelaraskan energi dan membangkitkan kesadaran dari dalam diri. Jadikan pakaian yang kamu kenakan sebagai pengingat untuk selalu hadir utuh, membumi, dan terhubung dengan semesta.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}