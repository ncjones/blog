import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.ncjones.com/',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [
      'rehype-slug',
    ],
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'rose-pine',
      langs: [],
      wrap: false
    }
  }
});

