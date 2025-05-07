<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Giscus from "@giscus/vue";
import { usePageId } from "../../composables";

const { isDark, frontmatter, theme } = useData();
const { Layout } = DefaultTheme;
const pageId = usePageId();
const { comment } = theme.value;
</script>

<template>
    <Layout v-bind="$attrs">
        <template v-if="comment && frontmatter.comment !== false" #doc-after>
            <div class="doc-comments">
                <Giscus
                    id="comments"
                    mapping="specific"
                    :term="pageId"
                    strict="1"
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="top"
                    :theme="isDark ? 'dark' : 'light'"
                    lang="zh-CN"
                    loading="lazy"
                    v-bind="{ ...comment }"
                />
            </div>
        </template>
    </Layout>
</template>

<style>
.doc-comments {
    margin-top: 24px;
    margin-bottom: 48px;
    border-top: 1px solid var(--vp-c-divider);
    padding-top: 24px;
}

/* 默认 overlay 的 z-index 可能不足以盖住侧边栏／导航 */
:root {
    --medium-zoom-z-index: 100;
    --medium-zoom-c-bg: var(--vp-c-bg);
}

.medium-zoom-overlay {
    /* override element style set by medium-zoom script */
    z-index: var(--medium-zoom-z-index);
    background-color: var(--medium-zoom-c-bg) !important;
}

.medium-zoom-overlay ~ img {
    z-index: calc(var(--medium-zoom-z-index) + 1);
}
</style>
