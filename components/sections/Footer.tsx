import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Контакты</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="text-gray-700">Санкт-Петербург</p>
                  <p className="text-sm text-gray-600">
                    ул. Примерная, д. 1, офис 10
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-blue-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+78121234567"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  +7 (812) 123-45-67
                </a>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-blue-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@soft-windows-spb.ru"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  info@soft-windows-spb.ru
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Мы в соцсетях
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="ВКонтакте"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.785 16.241s.336-.041.508-.25c.173-.208.167-.6.167-.6s-.024-1.488.675-1.708c.688-.22 1.57 1.48 2.504 2.135.703.49 1.235.382 1.235.382l2.495-.036s1.305-.084.686-1.11c-.051-.082-.363-.76-1.863-2.151-1.575-1.465-1.363-1.23.534-3.77 1.17-1.97 1.638-3.174 1.492-3.69-.14-.5-1-.52-1-.52l-2.53.016s-.188.026-.325.15c-.135.123-.22.41-.22.41s-.395 1.18-.86 2.186c-1.04 2.22-1.457 2.34-1.627 2.204-.4-.32-.3-1.28-.3-1.96 0-2.13.32-3.02-.626-3.25-.314-.08-.545-.133-1.35-.141-.73-.007-1.35.003-1.7.003-.22.01-.38.15-.38.15s-.25.33-.29.96c-.21 2.11-.31 3.42-.7 3.85-.16.18-.46.24-.64.18-.16-.05-.28-.18-.28-.18s-1.88-2.5-2.67-3.58c-1.01-1.35-2.12-1.88-2.12-1.88l-1.89-.12s-.28.08-.38.25c-.09.17-.01.52-.01.52s1.5 3.5 3.2 5.28c1.55 1.6 3.32 1.5 3.32 1.5l.8-.1c.16-.02.25.12.25.28l-.02 1.05s-.02.75.18.88c.18.13.63.24 1.13.73.8.78 1.87 2.32 1.87 3.15 0 .35-.08.7-.08.7s-.05.38.3.52c.35.15.84.28 1.5.28.66 0 1.7-.28 2.7-1.05 1.01-.78 1.78-1.95 1.78-1.95s.1-.2.25-.15c.15.05.15.4.15.4z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="Telegram"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.77.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Как нас найти</h3>
            <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden shadow-md bg-gray-200">
              {/* Placeholder for map - можно заменить на реальную карту (Yandex Maps, Google Maps) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="h-16 w-16 text-blue-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-gray-600">Карта</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Санкт-Петербург
                  </p>
                </div>
              </div>
              {/* Здесь можно встроить Yandex Maps или Google Maps */}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Мягкие окна СПб. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

