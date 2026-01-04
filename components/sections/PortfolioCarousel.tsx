import Image from "next/image";

export default function PortfolioCarousel() {
  const carouselImages = [
    {
      src: "/photo_dom_1.jpg",
      alt: "Терраса с мягкими окнами - вид 1",
    },
    {
      src: "/photo_dom_2.jpg",
      alt: "Терраса с мягкими окнами - вид 2",
    },
    {
      src: "/photo_krylcho.jpg",
      alt: "Крыльцо с мягкими окнами",
    },
  ];

  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 rounded-lg overflow-hidden">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className="relative h-48 sm:h-64 lg:h-80 rounded-lg overflow-hidden shadow-md"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, 33vw"
              />
              {/* Play button overlay for center image (optional) */}
              {index === 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
                  <div className="bg-white/90 rounded-full p-4">
                    <svg
                      className="h-8 w-8 text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

