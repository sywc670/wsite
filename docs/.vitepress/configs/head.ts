import type { HeadConfig } from "vitepress";

export const head: HeadConfig[] = [
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
];
