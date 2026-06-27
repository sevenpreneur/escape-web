import EscapeLogo from "@/components/icons/escape";
import Image from "next/image";

export default function AboutHero() {
    return (
        <section className="relative bg-black">
            <div className="relative w-full aspect-16/10 max-h-screen">
                <Image
                    src="/images/about-hero.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                    aria-hidden
                />
                {/* bottom fade into black */}
            </div>

            {/* text block overlapping the fade */}
            <div className="relative z-10 -mt-32 flex flex-col items-center px-4 pb-16 text-center sm:-mt-40 md:-mt-72">
                <EscapeLogo className="mb-4 h-8 w-auto text-white sm:h-10" />

                <h1 className="mb-4 text-4xl font-light tracking-widest text-white sm:text-5xl md:text-6xl">
                    ABOUT ESCAPE
                </h1>

                <p className="max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
                    Selama berabad-abad, para ulama dan cendekiawan Muslim justru dikenal karena
                    keberanian intelektual mereka — bukan karena diam. Escape hadir untuk
                    menghidupkan kembali tradisi itu: ruang di mana spiritualitas dibahas dengan
                    akal, hati, dan keberanian yang setara.
                </p>
            </div>
        </section>
    );
}