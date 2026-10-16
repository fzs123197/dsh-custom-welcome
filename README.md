# dsh-custom-welcome

DSH（DeepSeek Harness）客户端插件：替换新会话首页欢迎文字，并在 **设置** 中提供自定义文字页面。

## 功能

- **首页欢迎文字替换**：主标题「探索未至之境」→ 可配置文案，副标题「Into the Unknown」→ 可配置文案。
- **设置页**：打开 DSH 设置 → **自定义欢迎文字**，编辑「首页主标题」「首页副标题」，保存后立即生效（无需重启）。
- **仅在首页执行**：以「欢迎主标题仍为原始文案」作为首页特征，非首页不产生任何改动；SPA 路由切换回首页时自动重新应用。
- 设置值持久化到 Host 设置文档（与官方设置页同一机制），支持「恢复默认」。

## 安装

```bash
dsh plugin --profile web add link:"<本仓库绝对路径>"
```

或从 npm / GitHub 安装后启用插件。安装完成后无需重启（启用了 HMR 的 profile 会自动重组；未启用则重启 `dsh --profile web`）。

## 使用

1. 打开 DSH Web，进入 **设置 → 自定义欢迎文字**。
2. 修改「首页主标题」「首页副标题」，点击 **保存**（留空保存 = 恢复默认）。
3. 回到新会话首页即可看到新文字。

## 文件结构

| 文件 | 作用 |
| --- | --- |
| `package.json` | npm 包清单 + `dsh` 插件声明（`dsh.bundle.patch`、`dsh.client`） |
| `cordis.patch.yml` | bundle patch：插入 `custom-welcome` 插件行 |
| `lib/index.js` | 宿主半侧：声明设置命名空间 `custom-welcome` 的 volatile 字段 |
| `lib/client.js` | 浏览器半侧：设置分区注册 + 首页文字替换 |

## 说明

- 插件包名：`dsh-custom-welcome`；设置命名空间（条目 id）：`custom-welcome`。
- 默认文案：主标题 `欢迎使用DSH`、副标题 `Custom AI Harness`（见 `lib/index.js` 的 Config 默认值）。
- 若页面结构变化导致选择器失效，需同步调整 `lib/client.js` 中的 `h1` / `h1 + p` 选择器。
