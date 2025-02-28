// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-04-03",
  typescript: { typeCheck: "build" },
  modules: [
    "@sit-onyx/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
  ],
  css: ["@fontsource-variable/source-code-pro", "@fontsource-variable/source-sans-3"],
  app: {
    head: {
      title: "Planning Poker",
      link: [{ rel: "icon", href: "/favicon.svg" }],
    },
  },
  i18n: {
    lazy: true,
    defaultLocale: "en-US",
    locales: [{ code: "en-US", file: "en-US.json" }],
  },
  colorMode: {
    preference: "dark",
    classSuffix: "", // remove suffix so the CSS class is e.g. "dark"
  },
  onyx: {
    i18n: {
      registerLocales: {
        "en-US": "en-US",
      },
    },
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
});
