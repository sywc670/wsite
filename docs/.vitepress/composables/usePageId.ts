import { useData } from "vitepress";
import { useFormatPath } from "./useFormatPath";
import { computed } from "vue";

export function usePageId() {
    const { frontmatter } = useData();
    const formatPath = useFormatPath();

    return computed(() => frontmatter.value.pageId || formatPath.value);
}
