# dsh-custom-welcome

DSH（DeepSeek Harness）客户端插件：替换新会话首页欢迎文字与鲸鱼图标，并在 **设置** 中提供自定义页面。

## 功能

- **首页欢迎文字替换**：将新会话首页主标题「探索未至之境」/「Into the Unknown」替换为设置中的文案（预览版徽章保留不动）。
- **首页图标替换**：将欢迎页鲸鱼图标替换为自定义 Emoji（如 🚀）或图片链接；留空则保留默认鲸鱼。
- **设置页**：打开 DSH 设置 → **自定义欢迎文字**，编辑「首页主标题」「首页副标题」「首页图标」，保存后立即生效（无需重启）。
- **仅在首页执行**：以「标题元素仍为原始文案」作为首页特征，非首页不产生任何改动；SPA 路由切换回首页时自动重新应用。
- 设置值持久化到 Host 设置文档（与官方设置页同一机制），支持「恢复默认」。

## 安装

```bash
dsh plugin --profile web add link:"<本仓库绝对路径>"
```

桌面端在 **插件** 面板中从 GitHub 仓库添加（`https://github.com/fzs123197/dsh-custom-welcome`）。
插件安装后暂不支持自动更新：升级需先卸载再安装新版。

## 使用

1. 打开 DSH Web，进入 **设置 → 自定义欢迎文字**。
2. 修改「首页主标题」「首页副标题」「首页图标」，点击 **保存**（留空保存 = 恢复默认）。
3. 回到新会话首页即可看到新文字与新图标。

「首页图标」支持三种形式：
- **Emoji / 文字**：直接填写，如 `🚀`、`DSH`。
- **图片链接**：填写 `http(s)://`、`data:image` 或 `/` 开头的图片地址，按原始比例渲染。
- **本地图片**：点击「选择本地图片」按钮，从本机选择图片文件，自动转为 data URL 写入并保存（建议小图，大图会增大设置文档体积）。

## 文件结构

| 文件 | 作用 |
| --- | --- |
| `package.json` | npm 包清单 + `dsh` 插件声明（`dsh.bundle.patch`、`dsh.client`） |
| `cordis.patch.yml` | bundle patch：插入 `custom-welcome` 插件行 |
| `lib/index.js` | 宿主半侧：声明设置命名空间 `custom-welcome` 的 volatile 字段 |
| `lib/client.js` | 浏览器半侧：设置分区注册 + 首页文字/图标替换 |

## 说明

- 插件包名：`dsh-custom-welcome`；设置命名空间（条目 id）：`custom-welcome`。
- 默认文案：主标题 `欢迎使用DSH`、副标题 `Custom AI Harness`（见 `lib/index.js` 的 Config 默认值）；图标默认留空（保留官方鲸鱼）。
- 首页标题元素为 `span.titleGroup` 内的裸文本 `span`（非 h1）；「预览版」徽章是独立元素，替换时保留。
- 图标通过官方插槽 `conversation.hero.brand.mark` 注册，替换仅在设置了图标值时生效（未设置即注销，回退官方鲸鱼）。
- 「副标题」字段是兼容保留项：当前 DSH 欢迎页没有独立副标题（`Into the Unknown` 实为英文 locale 的主标题），无匹配元素时不生效。
- 若页面结构变化导致定位失效，需同步调整 `lib/client.js` 中的 `findHeadline()`。
