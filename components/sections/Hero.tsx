import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/photo_dom_1.jpg"
          alt="Терраса с мягкими окнами в дождливую погоду"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Мягкие окна
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-white mb-8">
            для террас и беседок
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#calculator"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors shadow-md"
            >
              Рассчитать стоимость
            </Link>
            <Link
              href="#measurement"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-md"
            >
              Заказать замер
            </Link>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        <div className="h-2 w-2 rounded-full bg-white" />
        <div className="h-2 w-2 rounded-full bg-white/50" />
        <div className="h-2 w-2 rounded-full bg-white/50" />
      </div>
    </section>
  );
}

