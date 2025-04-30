import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import WTheme from "./WTheme.vue";

import { createMediumZoomProvider } from "../composables/useMediumZoom";

export default {
    extends: DefaultTheme,
    Layout: WTheme,
    enhanceApp({ app, router }) {
        createMediumZoomProvider(app, router);
    },
} satisfies Theme;
