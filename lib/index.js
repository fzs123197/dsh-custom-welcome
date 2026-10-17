// dsh-custom-welcome 宿主半侧
// 声明设置命名空间「custom-welcome」的可编辑字段（volatile）。
// 替换欢迎文字的实际逻辑在浏览器半侧（lib/client.js）完成。
import z from "@deepseek-ai/schemastery";

/** Cordis 插件名（loader 诊断使用）。 */
export const name = "custom-welcome";

/** 无需注入服务；替换逻辑在浏览器半侧完成。 */
export const inject = [];

/** 设置命名空间的 volatile 字段 → 出现在 DSH 设置的「自定义欢迎文字」页面。 */
export const Config = z.object({
  welcomeTitle: z.string().default("欢迎使用DSH").volatile(),
  welcomeSubtitle: z.string().default("Custom AI Harness").volatile(),
  welcomeIcon: z.string().default("").volatile(),
  appIcon: z.string().default("").volatile(),
  windowTitle: z.string().default("").volatile(),
  appName: z.string().default("").volatile(),
});

/** 宿主半侧无需逻辑。 */
export function apply() {}
