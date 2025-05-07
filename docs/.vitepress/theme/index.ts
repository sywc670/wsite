import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import WTheme from "./components/WTheme.vue";
import WNavLinks from "./components/WNavLinks.vue";

import { createMediumZoomProvider } from "../composables/useMediumZoom";

export default {
    extends: DefaultTheme,
    Layout: WTheme,
    enhanceApp({ app, router }) {
        createMediumZoomProvider(app, router);
        app.component("WNavLinks", WNavLinks);
    },
} satisfies Theme;
