<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Giscus from "@giscus/vue";
import { usePageId } from "../composables";

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
</style>
