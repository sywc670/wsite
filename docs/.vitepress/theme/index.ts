import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import WTheme from "./WTheme.vue";

export default {
    extends: DefaultTheme,
    Layout: WTheme,
} satisfies Theme;
