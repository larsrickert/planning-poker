import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-03-11",
  typescript: { typeCheck: "build" },
  modules: [
    "@sit-onyx/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
    "@nuxtjs/mdc",
  ],
  css: [
    "~/assets/css/index.scss",
    "@fontsource-variable/source-sans-3",
    "@fontsource-variable/source-code-pro",
    "@sit-onyx/mdc/style.css",
  ],
  app: {
    head: {
      link: [{ rel: "icon", href: "/favicon.svg" }],
    },
  },
  i18n: {
    defaultLocale: "en-US",
    strategy: "no_prefix",
    locales: [
      { code: "en-US", file: "en-US.json", name: "English" },
      { code: "de-DE", file: "de-DE.json", name: "Deutsch" },
    ],
  },
  components: [{ path: "~/components", pathPrefix: false }],
  mdc: {
    components: {
      map: {
        input: "ProseInput",
      },
    },
  },
  nitro: {
    compressPublicAssets: true,
    experimental: {
      websocket: true,
    },
    hooks: {
      "build:before": async (nitro) => {
        // copy database migrations files to build output so they can be applied
        // by the app when starting (see server/plugins/migration.server.ts)
        const targetDir = path.join(nitro.options.output.serverDir, "database/migrations");
        await mkdir(targetDir, { recursive: true });
        await cp("./server/database/migrations", targetDir, { recursive: true });
      },
    },
  },
  runtimeConfig: {
    db: {
      name: process.env.NUXT_POSTGRES_DB,
      user: process.env.NUXT_POSTGRES_USER,
      password: process.env.NUXT_POSTGRES_PASSWORD,
      host: process.env.NUXT_POSTGRES_HOST,
    },
  },
});
