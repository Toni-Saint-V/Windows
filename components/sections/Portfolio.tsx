import Image from "next/image";

export default function Portfolio() {
  const portfolioImages = [
    {
      src: "/photo_dom_1.jpg",
      alt: "Терраса с мягкими окнами - фото 1",
    },
    {
      src: "/photo_dom_2.jpg",
      alt: "Терраса с мягкими окнами - фото 2",
    },
    {
      src: "/photo_krylcho.jpg",
      alt: "Крыльцо с мягкими окнами",
    },
    // Добавляем заглушки для дополнительных фото, если нужно больше
    {
      src: "/photo_dom_1.jpg",
      alt: "Терраса с мягкими окнами - фото 3",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Наши работы
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {portfolioImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

