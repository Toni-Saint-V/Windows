export default function Prices() {
  const priceItems = [
    {
      type: "Терраса",
      description: "Мягкие окна для террасы",
      price: "от 2 500 ₽/м²",
      features: ["ПВХ 700 микрон", "Монтаж включен", "Гарантия 2 года"],
    },
    {
      type: "Беседка",
      description: "Мягкие окна для беседки",
      price: "от 2 800 ₽/м²",
      features: ["ПВХ 700 микрон", "Монтаж включен", "Гарантия 2 года"],
    },
    {
      type: "Веранда",
      description: "Мягкие окна для веранды",
      price: "от 2 600 ₽/м²",
      features: ["ПВХ 700 микрон", "Монтаж включен", "Гарантия 2 года"],
    },
  ];

  return (
    <section id="prices" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Цены
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {priceItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.type}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
              <div className="mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {item.price}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="h-4 w-4 text-green-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#calculator"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Рассчитать
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 mt-8 text-sm">
          * Точная стоимость рассчитывается индивидуально после замера
        </p>
      </div>
    </section>
  );
}

