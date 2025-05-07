import type { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Config["sidebar"] = [
    {
        text: "个人思考",
        items: [{ text: "学习路径", link: "/think/学习路径" }],
    },
    {
        text: "知识笔记",
        items: [{ text: "网络", link: "/network/network" }],
    },
];
