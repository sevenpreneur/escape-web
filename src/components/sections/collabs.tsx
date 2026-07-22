import Image from "next/image";

const brands = [
    { src: '/images/brand1.png', alt: 'Brand 1', width: 71,  height: 64  },
    { src: '/images/brand2.png', alt: 'Brand 2', width: 70,  height: 45  },
    { src: '/images/brand3.png', alt: 'Brand 3', width: 130, height: 28  },
    { src: '/images/brand4.png', alt: 'Brand 4', width: 89,  height: 89  },
    { src: '/images/brand5.png', alt: 'Brand 5', width: 89,  height: 89  },
    { src: '/images/brand6.png', alt: 'Brand 6', width: 89,  height: 89  },
];

function BrandStrip({ keyPrefix }: { keyPrefix: string }) {
    return (
        <>
            {[...Array(5)].map((_, setIndex) => (
                <div
                    key={`${keyPrefix}-${setIndex}`}
                    className="flex shrink-0 items-center"
                >
                    {brands.map((brand, brandIndex) => (
                        <div
                            key={brandIndex}
                            className="mx-4 flex h-12 items-center sm:mx-6 sm:h-14 md:mx-8 md:h-16"
                        >
                            <Image
                                src={brand.src}
                                alt={brand.alt}
                                width={brand.width}
                                height={brand.height}
                                className="h-full w-auto max-w-20 object-contain sm:max-w-25 md:max-w-30"
                            />
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}

export default function CollabSection() {
    const collaborators = [
        { image: '/images/people/1.png' },
        { image: '/images/people/2.png' },
        { image: '/images/people/3.png' },
        { image: '/images/people/4.png' },
        { image: '/images/people/5.png' },
        { image: '/images/people/6.png' },
        { image: '/images/people/7.png' },
        { image: '/images/people/8.png' },
        { image: '/images/people/9.png' },
        { image: '/images/people/10.png' },
        { image: '/images/people/11.png' },
        { image: '/images/people/12.png' },
        { image: '/images/people/13.png' },
        { image: '/images/people/14.png' },
        { image: '/images/people/15.png' },
        { image: '/images/people/16.png' },
        { image: '/images/people/17.png' },
        { image: '/images/people/18.png' },
        { image: '/images/people/19.png' },
        { image: '/images/people/20.png' },
        { image: '/images/people/21.png' },
    ];

    return (
        <section className="bg-black py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="mx-auto w-full">

                {/* Section Title */}
                <div className="mb-8 text-center sm:mb-10 md:mb-12">
                    <p className="text-sm font-normal text-gray-300 sm:text-base">
                        Brand and People collaborated with us
                    </p>
                </div>

                {/* Infinite Scroll Brands */}
                <div className="mb-10 overflow-hidden sm:mb-12 md:mb-14 lg:mb-16">
                    <div className="animate-scroll-seamless hover:[animation-play-state:paused] flex items-center">
                        <BrandStrip keyPrefix="set1" />
                        <BrandStrip keyPrefix="set2" />
                    </div>
                </div>

                {/* Collaborators Grid — 3 rows x 7 cols */}
                <div className="grid grid-cols-3 gap-2 px-6 sm:grid-cols-5 sm:gap-3 md:grid-cols-7 md:gap-3 lg:gap-8">
                    {collaborators.map((collab, index) => (
                        <div
                            key={index}
                            className="aspect-square overflow-hidden bg-gray-800"
                        >
                            <Image
                                src={collab.image}
                                alt=""
                                className="h-full w-full object-cover"
                                width={400}
                                height={400}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}