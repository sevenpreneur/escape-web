"use client";
import { useState } from "react";
import Image from "next/image";

const slides = [
    {
        image: "/images/carrousel1.png",
        title: "Elevate your style",
        subtitle: "Escape Fashion & Merch!",
    },
    {
        image: "/images/carrousel1.png",
        title: "Wear your identity",
        subtitle: "Escape Fashion & Merch!",
    },
    {
        image: "/images/carrousel1.png",
        title: "Dress the culture",
        subtitle: "Escape Fashion & Merch!",
    },
];

export default function MerchCarousel() {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
    const next = () => setCurrent((c) => (c + 1) % slides.length);

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black select-none">
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{
                    width: `${slides.length * 100}%`,
                    transform: `translateX(-${(current * 100) / slides.length}%)`,
                }}
            >
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className="relative h-full"
                        style={{ width: `${100 / slides.length}%` }}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            priority={i === 0}
                            sizes="100vw"
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

                        <div className="absolute bottom-16 left-5 right-5 flex flex-col gap-1 sm:bottom-auto sm:top-10 sm:left-10 sm:right-auto md:top-12 md:left-12 lg:top-16 lg:left-16">
                            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                                {slide.title}
                            </h1>
                            <p
                                className="text-lg italic font-light text-white/90 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                                style={{ fontFamily: "Georgia, serif" }}
                            >
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Left arrow */}
            <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition hover:bg-white active:scale-95 sm:h-10 sm:w-10 md:h-12 md:w-12"
            >
                <svg className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            {/* Right arrow */}
            <button
                onClick={next}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition hover:bg-white active:scale-95 sm:h-10 sm:w-10 md:h-12 md:w-12"
            >
                <svg className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="transition-all duration-300"
                    >
                        <span
                            className="block rounded-full bg-white transition-all duration-300"
                            style={{
                                width: i === current ? "20px" : "8px",
                                height: "8px",
                                opacity: i === current ? 1 : 0.5,
                            }}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}