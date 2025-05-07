import { defineConfig } from "vitepress";
import { head, nav, sidebar } from "./configs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Will Place",
    // titleTemplate: ":title | Will Place",
    description: "Feel Explore Interpret Document Share",
    cleanUrls: true,
    head,
    base: "/",
    appearance: "dark",
    lastUpdated: true,
    markdown: {
        lineNumbers: true,
    },
    themeConfig: {
        logo: "/favicon.png",
        // https://vitepress.dev/reference/default-theme-config
        search: {
            provider: "local",
        },
        nav,
        sidebar,

        socialLinks: [{ icon: "github", link: "https://github.com/sywc670" }],
        comment: {
            repo: "sywc670/wsite",
            repoId: "R_kgDOOiEdDQ",
            category: "Announcements",
            categoryId: "DIC_kwDOOiEdDc4CpncF",
        },
    },
    // rewrites: {
    //   'source/:page': 'destination/:page'
    // }
});
