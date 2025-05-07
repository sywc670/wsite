import type { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.Config["nav"] = [
    { text: "Home", link: "/" },
    { text: "Network", link: "/network/network" },
    // 下拉列表：
    {
        text: "Think",
        items: [{ text: "学习路径", link: "/think/学习路径" }],
    },
    {
        text: "Tools",
        items: [
            {
                text: "学习专注工具",
                link: "https://github.com/sywc670/random-replay",
            },
        ],
    },
];
