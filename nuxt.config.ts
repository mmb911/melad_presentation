export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      title: 'محطة وقود ذكية | مشروع التخرج',
      meta: [
        { name: 'description', content: 'عرض مشروع محطة وقود ذكية باستخدام إنترنت الأشياء وتقنية RFID.' },
        { name: 'theme-color', content: '#071512' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap' }
      ]
    }
  }
})
