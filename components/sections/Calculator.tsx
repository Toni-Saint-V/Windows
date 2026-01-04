"use client";

import { useState } from "react";
import Image from "next/image";

export default function Calculator() {
  const [formData, setFormData] = useState({
    type: "",
    size: "",
    material: "",
    installation: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculatorImages = [
    {
      src: "/photo_dom_1.jpg",
      alt: "Пример работы 1",
    },
    {
      src: "/photo_dom_2.jpg",
      alt: "Пример работы 2",
    },
    {
      src: "/photo_krylcho.jpg",
      alt: "Пример работы 3",
    },
  ];

  return (
    <section id="calculator" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Калькулятор стоимости
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип конструкции
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Выберите тип</option>
                <option value="terrace">Терраса</option>
                <option value="gazebo">Беседка</option>
                <option value="veranda">Веранда</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Размер
              </label>
              <select
                value={formData.size}
                onChange={(e) => handleChange("size", e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Выберите размер</option>
                <option value="small">До 10 м²</option>
                <option value="medium">10-20 м²</option>
                <option value="large">20-30 м²</option>
                <option value="xlarge">Более 30 м²</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Материал
              </label>
              <select
                value={formData.material}
                onChange={(e) => handleChange("material", e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Выберите материал</option>
                <option value="pvc700">ПВХ 700 микрон</option>
                <option value="pvc500">ПВХ 500 микрон</option>
                <option value="premium">Премиум ПВХ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Монтаж
              </label>
              <select
                value={formData.installation}
                onChange={(e) => handleChange("installation", e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Выберите опцию</option>
                <option value="full">Полный монтаж</option>
                <option value="partial">Частичный монтаж</option>
                <option value="none">Без монтажа</option>
              </select>
            </div>

            <button
              type="button"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              Рассчитать стоимость
            </button>
          </div>

          {/* Example Images */}
          <div className="grid grid-cols-3 gap-4">
            {calculatorImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden shadow-md"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

