import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Will Place",
  // titleTemplate: ":title | Will Place",
  description: "Feel Explore Interpret Document Share",
  cleanUrls: true,
  head: [["link", { rel: "icon", href: "/favicon.png" }]],
  base: "/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
      { text: "Network", link: "/network/network" },
    ],
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
          { text: "Network", link: "/network/network" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/sywc670" }],
  },
  // rewrites: {
  //   'source/:page': 'destination/:page'
  // }
});
