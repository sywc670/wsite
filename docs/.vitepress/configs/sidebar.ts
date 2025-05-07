import type { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Config["sidebar"] = [
    {
        text: "Network",
        items: [{ text: "Network", link: "/network/network" }],
    },
    {
        text: "Think",
        items: [{ text: "学习路径", link: "/think/学习路径" }],
    },
];
