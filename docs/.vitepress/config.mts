import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Will Place",
    // titleTemplate: ":title | Will Place",
    description: "Feel Explore Interpret Document Share",
    cleanUrls: true,
    head: [
        ["link", { rel: "icon", href: "/favicon.png" }],
        ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
        [
            "link",
            {
                rel: "preconnect",
                href: "https://fonts.gstatic.com",
                crossorigin: "",
            },
        ],
        [
            "link",
            {
                href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
                rel: "stylesheet",
            },
        ],
    ],
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
        nav: [
            { text: "Home", link: "/" },
            { text: "Network", link: "/network/network" },
            // 下拉列表：
            {
                text: "Think",
                items: [{ text: "学习路径", link: "/think/学习路径" }],
            },
        ],
        sidebar: [
            {
                text: "Network",
                items: [{ text: "Network", link: "/network/network" }],
            },
            {
                text: "Think",
                items: [{ text: "学习路径", link: "/think/学习路径" }],
            },
        ],

        socialLinks: [{ icon: "github", link: "https://github.com/sywc670" }],
        comment: {
            repo: "sywc670/wsite",
            repoId: "xxx",
            category: "Announcements",
            categoryId: "xxx",
        },
    },
    // rewrites: {
    //   'source/:page': 'destination/:page'
    // }
});
