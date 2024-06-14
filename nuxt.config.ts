// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@sit-onyx/nuxt",
  ],
  app: {
    head: {
      title: "Planning Poker",
      link: [{ rel: "icon", href: "/favicon.svg" }],
    },
  },
  i18n: {
    lazy: true,
    langDir: "lang",
    defaultLocale: "en",
    locales: [{ code: "en", file: "en-US.json" }],
  },
  colorMode: {
    preference: "dark",
    classSuffix: "", // remove suffix so the CSS class is e.g. "dark"
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
});
