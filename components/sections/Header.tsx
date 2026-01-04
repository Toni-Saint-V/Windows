import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="Мягкие окна СПб - Главная">
            <Image
              src="/window.svg"
              alt="Логотип Мягкие окна"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold text-gray-900">мягкие окна</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#calculator"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Рассчитать стоимость
            </Link>
            <Link
              href="#measurement"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Заказать замер
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Связаться
            </Link>
            <Link
              href="#prices"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Цены
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Поиск"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Профиль"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

