import type { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.Config["nav"] = [
    { text: "网页导航", link: "/nav/" },
    {
        text: "个人思考",
        items: [{ text: "学习路径", link: "/think/学习路径" }],
    },
    {
        text: "知识笔记",
        items: [{ text: "网络", link: "/network/network" }],
    },
    {
        text: "开发工具",
        items: [
            {
                text: "学习专注工具",
                link: "https://github.com/sywc670/random-replay",
            },
        ],
    },
];
