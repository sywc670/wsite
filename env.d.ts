/// <reference types="vitepress/client" />

import { DefaultTheme } from "vitepress";

declare module "vitepress" {
    export namespace DefaultTheme {
        export interface Config {
            comment?: {
                /** github 仓库地址 */
                repo: `${string}/${string}`;
                /** giscus 仓库 ID */
                repoId: string;
                /** Discussion 分类 */
                category: string;
                /** giscus 分类 ID */
                categoryId: string;
            };
        }
    }
}
