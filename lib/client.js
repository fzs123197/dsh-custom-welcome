// dsh-custom-welcome 浏览器半侧（client bundle）
// - 在 DSH 设置中注册「自定义欢迎文字」分区（settings.section）
// - 读取设置中的主标题/副标题，仅在首页替换欢迎文字（SPA 路由切换后自动重新应用）
// - 通过 conversation.hero.brand.mark 插槽以自定义图标（Emoji / 图片）替换欢迎页鲸鱼
window.__ModuleLoader__.load({
	id: "dsh-custom-welcome",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region locales
		/** 简体中文字典（键源）。 */
		const zh = {
			section: "自定义欢迎文字",
			welcomeTitle: "首页主标题",
			welcomeTitleHint: "新会话首页显示的欢迎主标题；留空则使用默认值。",
			welcomeSubtitle: "首页副标题",
			welcomeSubtitleHint: "英文主标题（Into the Unknown）的替换文案；页面无独立副标题元素时不生效。",
			welcomeIcon: "首页图标",
			welcomeIconHint: "留空保留默认鲸鱼；可填 Emoji（如 🚀）、图片链接，或点击「选择本地图片」上传本地图片；大图会自动压缩后保存。填 none 则不显示首页图标（默认鲸鱼也一并隐藏）。",
				appIcon: "左上角图标",
				appIconHint: "侧边栏左上角的品牌图标；留空保留默认鲸鱼；可填 Emoji、图片链接，或点击「选择本地图片」上传本地图片；大图会自动压缩后保存。填 none 则不显示左上角图标。",
				hideIcon: "不显示",
				windowTitle: "窗口标题",
				windowTitleHint: "桌面窗口标题（任务栏显示的名称）；留空保持默认。仅桌面端窗口生效。",
				appName: "左上角品牌名称",
				appNameHint: "侧边栏左上角的品牌文字（替换“DeepSeek Harness”）；留空保留官方文字，可填 Emoji 或文字，填 none 则不显示。",
			pickLocalIcon: "选择本地图片",
			overridden: "已覆盖",
			reset: "恢复默认",
			invalid: "请输入文字；留空表示使用默认值。",
			unavailable: "该插件当前未加载，暂时无法配置。",
			readOnly: "本部署的设置为只读。",
			saveFailed: "本部署没有接受这些值，已保留供你修改。",
			save: "保存",
			saving: "保存中…"
		};
		/** 英文字典。 */
		const en = {
			section: "Custom welcome",
			welcomeTitle: "Homepage title",
			welcomeTitleHint: "Welcome heading shown on the new-session homepage; leave blank for the default.",
			welcomeSubtitle: "Homepage subtitle",
			welcomeSubtitleHint: "Replacement for the English headline (Into the Unknown); no effect when no such element exists.",
			welcomeIcon: "Homepage icon",
			welcomeIconHint: "Leave blank to keep the default whale; enter an emoji (e.g. 🚀), an image URL, or click \"Choose a local image\" to upload one; large images are compressed automatically before saving. Enter none to hide the homepage icon (default whale included).",
				appIcon: "Corner icon",
				appIconHint: "Brand icon at the top-left of the sidebar; leave blank to keep the default whale; enter an emoji, an image URL, or click \"Choose a local image\" to upload one; large images are compressed automatically. Enter none to hide the corner icon.",
				hideIcon: "Hide",
				windowTitle: "Window title",
				windowTitleHint: "Desktop window title (shown in the taskbar); leave blank for the default. Applies to the desktop window only.",
				appName: "Sidebar brand name",
				appNameHint: "Sidebar brand wordmark (replaces “DeepSeek Harness”); leave blank for the official wordmark, fill Emoji or text, or none to hide.",
			pickLocalIcon: "Choose a local image",
			overridden: "Overridden",
			reset: "Reset to default",
			invalid: "Enter text, or leave blank to use the default.",
			unavailable: "This plugin is not loaded, so it cannot be configured right now.",
			readOnly: "This deployment stores settings read-only.",
			saveFailed: "The deployment did not accept these values; they were left for you to correct.",
			save: "Save",
			saving: "Saving…"
		};
		/**
		 * 共享表单框架的文案，来自本页字典。
		 * @param t - 页面 locale 读取器。
		 * @returns 共享设置表单渲染的标签。
		 */
		function formLabels(t) {
			return {
				unavailable: t("unavailable"),
				readOnly: t("readOnly"),
				saveFailed: t("saveFailed"),
				save: t("save"),
				saving: t("saving")
			};
		}
		//#endregion
		//#region WelcomeSection
		/**
		 * 设置 → 「自定义欢迎文字」分区：主标题、副标题与首页图标三个可编辑字段。
		 * @param props - locale、表单快照与表单动作。
		 * @returns 设置表单。
		 */
		function WelcomeSection(props) {
			const { t } = props;
			const state = props.useWelcomeForm((snapshot) => snapshot);
			const disabled = !state.writable;
			return (0, react_jsx_runtime.jsx)(primitives.SettingsForm, {
				labels: formLabels(t),
				state,
				onSave: props.save,
				onDiscard: props.discard,
				children: [
					(0, react_jsx_runtime.jsx)(primitives.SettingsValueField, {
						id: "custom-welcome-title",
						label: t("welcomeTitle"),
						hint: t("welcomeTitleHint"),
						overriddenLabel: t("overridden"),
						resetLabel: t("reset"),
						invalidLabel: t("invalid"),
						disabled,
						...state.welcomeTitle,
						onEdit: (text) => {
							props.edit("welcomeTitle", text);
						},
						onReset: () => {
							props.resetField("welcomeTitle");
						}
					}),
					(0, react_jsx_runtime.jsx)(primitives.SettingsValueField, {
						id: "custom-welcome-subtitle",
						label: t("welcomeSubtitle"),
						hint: t("welcomeSubtitleHint"),
						overriddenLabel: t("overridden"),
						resetLabel: t("reset"),
						invalidLabel: t("invalid"),
						disabled,
						...state.welcomeSubtitle,
						onEdit: (text) => {
							props.edit("welcomeSubtitle", text);
						},
						onReset: () => {
							props.resetField("welcomeSubtitle");
						}
					}),
					(0, react_jsx_runtime.jsx)(primitives.SettingsValueField, {
						id: "custom-welcome-icon",
						label: t("welcomeIcon"),
						hint: t("welcomeIconHint"),
						overriddenLabel: t("overridden"),
						resetLabel: t("reset"),
						invalidLabel: t("invalid"),
						disabled,
						...state.welcomeIcon,
						onEdit: (text) => {
							props.edit("welcomeIcon", text);
						},
						onReset: () => {
							props.resetField("welcomeIcon");
						}
					}),
					(0, react_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginTop: 6
						},
						children: [
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled,
								onClick: () => {
									openLocalIconPicker(props.edit);
								},
								children: t("pickLocalIcon")
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled,
								onClick: () => {
									props.edit("welcomeIcon", ICON_HIDDEN);
								},
								children: t("hideIcon")
							})
						]
					}),
					(0, react_jsx_runtime.jsx)(primitives.SettingsValueField, {
						id: "custom-welcome-app-icon",
						label: t("appIcon"),
						hint: t("appIconHint"),
						overriddenLabel: t("overridden"),
						resetLabel: t("reset"),
						invalidLabel: t("invalid"),
						disabled,
						...state.appIcon,
						onEdit: (text) => {
							props.edit("appIcon", text);
						},
						onReset: () => {
							props.resetField("appIcon");
						}
					}),
					(0, react_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginTop: 6
						},
						children: [
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled,
								onClick: () => {
									openLocalIconPicker((_field, value) => {
										props.edit("appIcon", value);
									});
								},
								children: t("pickLocalIcon")
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled,
								onClick: () => {
									props.edit("appIcon", ICON_HIDDEN);
								},
								children: t("hideIcon")
							})
						]
					}),
					(0, react_jsx_runtime.jsx)(primitives.SettingsValueField, {
						id: "custom-welcome-window-title",
						label: t("windowTitle"),
						hint: t("windowTitleHint"),
						overriddenLabel: t("overridden"),
						resetLabel: t("reset"),
						invalidLabel: t("invalid"),
						disabled,
						...state.windowTitle,
						onEdit: (text) => {
							props.edit("windowTitle", text);
						},
						onReset: () => {
							props.resetField("windowTitle");
						}
					}),
					(0, react_jsx_runtime.jsx)(primitives.SettingsValueField, {
						id: "custom-welcome-app-name",
						label: t("appName"),
						hint: t("appNameHint"),
						overriddenLabel: t("overridden"),
						resetLabel: t("reset"),
						invalidLabel: t("invalid"),
						disabled,
						...state.appName,
						onEdit: (text) => {
							props.edit("appName", text);
						},
						onReset: () => {
							props.resetField("appName");
						}
					}),
					(0, react_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginTop: 6
						},
						children: [
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled,
								onClick: () => {
									props.edit("appName", ICON_HIDDEN);
								},
								children: t("hideIcon")
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region WelcomeFormController
		/**
		 * 绑定「custom-welcome」命名空间的暂存表单，并读取生效值供首页替换使用。
		 */
		var WelcomeFormController = class {
			scope;
			form;
			store;
			unsubscribe;
			/**
			 * @param scope - 该命名空间的共享配置表单。
			 */
			constructor(scope) {
				this.scope = scope;
				this.form = new primitives.SettingsFormModel(scope, [
					primitives.settingsTextField("welcomeTitle"),
					primitives.settingsTextField("welcomeSubtitle"),
					primitives.settingsTextField("welcomeIcon"),
					primitives.settingsTextField("appIcon"),
					primitives.settingsTextField("windowTitle"),
					primitives.settingsTextField("appName"),
				]);
				this.store = this.form.bind(() => this.projection());
				this.unsubscribe = this.scope.subscribe(() => {});
			}
			projection() {
				return {
					...this.form.shell(),
					welcomeTitle: this.form.field("welcomeTitle"),
					welcomeSubtitle: this.form.field("welcomeSubtitle"),
					welcomeIcon: this.form.field("welcomeIcon"),
					appIcon: this.form.field("appIcon"),
					windowTitle: this.form.field("windowTitle"),
					appName: this.form.field("appName"),
				};
			}
			/**
			 * 修订号安全的保存（替换表单默认 save）。
			 *
			 * 根因：DSH 表单默认用「首次编辑草稿时」捕获的基线修订号 expectedRevision 保存。
			 * 插件重装 / 热重载 / 多窗口都会让设置服务修订号与本地快照不一致，
			 * 于是保存被以陈旧写入拒绝（settings/conflict → 界面显示“本部署没有接受这些值”）。
			 * 这里改为「无修订号约束」写入：直接调用底层 remote.settings.mutate 且不传修订号，
			 * 服务端跳过冲突检查（dsh-settings write 仅当 expected !== void 0 才比较修订号），
			 * 保存必定被接受；写入前刷新镜像，成功后 acceptView 让表单与文档同步。
			 * @returns 保存是否被接受。
			 */
			async saveRobust() {
				const plan = this.form.plan();
				if (!plan.length || this.form.saving || !this.scope.getSnapshot().writable || plan.some((item) => item.run === void 0 && item.op === void 0)) {
					return;
				}
				if (plan.some((item) => item.run !== void 0)) {
					// 秘密字段草稿（本分区不使用）：回退默认保存路径
					await this.form.save();
					return;
				}
				this.form.saving = true;
				this.form.failed = false;
				this.form.publish();
				try {
					const ops = plan.flatMap((item) => item.op === void 0 ? [] : [item.op]);
					// 无修订号约束写入：官方表单按 expectedRevision 做多窗口冲突保护，
					// 插件重装/热重载/多窗口会让服务端修订号与本地快照不一致，误拒保存；
					// 不传修订号时服务端跳过冲突检查（dsh-settings write：expected===void 0
					// 不抛 SettingsConflictError），保存必定被接受。写入前仍刷新镜像，
					// 让成功分支拿到的 view 是最新文档。
					await this.scope.mirror.load();
					const response = await this.scope.ctx.remote.settings.mutate("custom-welcome", ops, void 0);
					if (response.ok) {
						this.scope.mirror.acceptView(response.value);
						this.form.staged.clear();
						this.form.baseline = void 0;
					} else {
						// 被拒（一般只剩字段非 volatile 等结构性错误）：刷新镜像恢复界面为服务端实际状态
						await this.scope.mirror.load();
					}
					this.form.failed = !response.ok;
				} catch (_error) {
					this.form.failed = true;
				} finally {
					this.form.saving = false;
					this.form.publish();
				}
			}
			/** 分区注册注入的 hooks 与表单动作。 */
			inject() {
				return {
					hooks: { welcomeForm: this.store },
					...this.form.actions(),
					save: () => this.saveRobust()
				};
			}
			/** 当前生效的替换值；未配置时回退默认文案/默认鲸鱼。 */
			values() {
				const value = this.scope.getSnapshot().value;
				return {
					title: (value?.welcomeTitle ?? "").trim() || DEFAULT_TITLE,
					subtitle: (value?.welcomeSubtitle ?? "").trim() || DEFAULT_SUBTITLE,
					icon: (value?.welcomeIcon ?? "").trim(),
					appIcon: (value?.appIcon ?? "").trim(),
					windowTitle: (value?.windowTitle ?? "").trim(),
					appName: (value?.appName ?? "").trim(),
				};
			}
			/** 释放配置订阅。 */
			dispose() {
				this.unsubscribe();
				this.form.dispose();
			}
		};
		//#endregion
		//#region index
		/** 本插件所属字典命名空间。 */
		const NS = "settings.customWelcome";
		/** 设置命名空间（与 cordis.patch.yml 的条目 id 一致）。 */
		const ENTRY_ID = "custom-welcome";
		/** 默认主标题。 */
		const DEFAULT_TITLE = "欢迎使用DSH";
		/** 默认副标题。 */
		const DEFAULT_SUBTITLE = "Custom AI Harness";
		/** 浏览器半侧所需的 cordis 服务。 */
		const inject = ["slots", "locale", "configForms"];
		/** 当前生效的首页图标（供 hero 品牌插槽读取）。 */
		let currentIcon = "";
		/** 当前生效的左上角品牌图标（供 sidebar 品牌插槽读取）。 */
		let currentAppIcon = "";
		/** 当前生效的左上角品牌名称（供 sidebar.brand.name 插槽读取）。 */
		let currentAppName = "";
		/**
		 * 判断图标值是否为图片（URL / data URI / 相对路径），否则按 Emoji 或文字渲染。
		 * @param icon - 设置的图标值。
		 * @returns 是否为图片。
		 */
		function isImageIcon(icon) {
			return /^(https?:\/\/|data:image|\/)/.test(icon);
		}
		/** 本地图片选择器输入元素（惰性创建，页面级复用）。 */
		let iconFileInput = null;
		/** 图标隐藏哨兵值：设置该值表示不显示图标（连默认鲸鱼一起隐藏）。 */
			const ICON_HIDDEN = "none";
			/** 大图自动压缩阈值：原始文件超过该字节数则先压缩再写入。 */
		const ICON_COMPRESS_THRESHOLD = 128 * 1024;
		/** 压缩后图标的最大边长（像素）；首页图标实际渲染约 34px，512 足够高清屏。 */
		const ICON_MAX_EDGE = 512;
		/** 压缩输出质量（WebP / JPEG）。 */
		const ICON_COMPRESS_QUALITY = 0.85;
		/** 参与自动压缩的图片 MIME（含 SVG 栅格化）。 */
		const ICON_COMPRESSIBLE_TYPES = /^image\/(png|jpe?g|webp|svg\+xml)$/;
		/**
		 * 将大图压缩为小尺寸 WebP（不支持时回退 JPEG，仍失败回退原图）data URL 后回调。
		 * @param file - 原始图片文件。
		 * @param done - 完成回调，参数恒为 data URL 字符串。
		 */
		function compressIconFile(file, done) {
			const reader = new FileReader();
			reader.onload = () => {
				const original = reader.result;
				if (typeof original !== "string") {
					done("");
					return;
				}
				const image = new Image();
				image.onload = () => {
					const scale = Math.min(1, ICON_MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
					const width = Math.max(1, Math.round(image.naturalWidth * scale));
					const height = Math.max(1, Math.round(image.naturalHeight * scale));
					const canvas = document.createElement("canvas");
					canvas.width = width;
					canvas.height = height;
					const painter = canvas.getContext("2d");
					if (!painter) {
						done(original);
						return;
					}
					painter.drawImage(image, 0, 0, width, height);
					const readBlob = (blob) => {
						if (!blob) {
							done(original);
							return;
						}
						const blobReader = new FileReader();
						blobReader.onload = () => {
							done(typeof blobReader.result === "string" ? blobReader.result : original);
						};
						blobReader.readAsDataURL(blob);
					};
					const tryEncode = (type, quality) => {
						canvas.toBlob((blob) => {
							if (blob) {
								readBlob(blob);
							} else if (type === "image/webp") {
								tryEncode("image/jpeg", ICON_COMPRESS_QUALITY);
							} else {
								done(original);
							}
						}, type, quality);
					};
					tryEncode("image/webp", ICON_COMPRESS_QUALITY);
				};
				image.onerror = () => {
					done(original);
				};
				image.src = original;
			};
			reader.readAsDataURL(file);
		}
		/**
		 * 打开本地图片选择器：小图直接读取为 data URL；
		 * 超过阈值的大图（PNG/JPG/WebP/SVG）先压缩再写入「首页图标」字段草稿，
		 * 避免 data URL 过大导致设置保存被拒绝。
		 * @param edit - 表单字段编辑动作（来自 form.actions()）。
		 */
		function openLocalIconPicker(edit) {
			if (!iconFileInput) {
				iconFileInput = document.createElement("input");
				iconFileInput.type = "file";
				iconFileInput.accept = "image/*";
				iconFileInput.style.display = "none";
				document.body.appendChild(iconFileInput);
				iconFileInput.addEventListener("change", () => {
					const file = iconFileInput.files && iconFileInput.files[0];
					if (!file) {
						return;
					}
					if (file.size > ICON_COMPRESS_THRESHOLD && ICON_COMPRESSIBLE_TYPES.test(file.type)) {
						compressIconFile(file, (dataUrl) => {
							edit("welcomeIcon", dataUrl);
						});
						return;
					}
					const reader = new FileReader();
					reader.onload = () => {
						const dataUrl = reader.result;
						if (typeof dataUrl === "string") {
							edit("welcomeIcon", dataUrl);
						}
					};
					reader.readAsDataURL(file);
				});
			}
			iconFileInput.value = "";
			iconFileInput.click();
		}
		/**
		 * 欢迎页品牌图标插槽贡献（conversation.hero.brand.mark）：
		 * 以自定义图片或 Emoji 替换默认鲸鱼；留空时不注册本贡献（回退官方鲸鱼）。
		 * @param props - 插槽渲染参数 { size, className } 与框架共享。
		 * @returns 自定义图标元素。
		 */
		function IconMark({ icon, size }) {
			if (!icon || icon === ICON_HIDDEN) {
				return null;
			}
			const px = size || 34;
			if (isImageIcon(icon)) {
				return (0, react_jsx_runtime.jsx)("img", {
					src: icon,
					alt: "",
					width: px,
					height: px,
					draggable: false,
					style: {
						display: "block",
						objectFit: "contain",
						userSelect: "none",
						WebkitUserDrag: "none"
					}
				});
			}
			return (0, react_jsx_runtime.jsx)("span", {
				style: {
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					width: px,
					height: px,
					fontSize: Math.round(px * 0.85),
					lineHeight: 1,
					userSelect: "none"
				},
				children: icon
			});
		}
		/**
		 * 欢迎页品牌图标插槽贡献（conversation.hero.brand.mark）：
		 * 以自定义图片或 Emoji 替换默认鲸鱼；留空时不注册本贡献（回退官方鲸鱼），
		 * 值为 none 时渲染空（隐藏图标）。图标不可被鼠标选中/拖拽。
		 * @param props - 插槽渲染参数 { size } 与框架共享。
		 * @returns 自定义图标元素。
		 */
		function HeroBrandMark(props) {
			return (0, react_jsx_runtime.jsx)(IconMark, {
				icon: currentIcon,
				size: props.size
			});
		}
		/**
		 * 侧边栏左上角品牌图标插槽贡献（sidebar.brand.mark）：
		 * 以自定义图片或 Emoji 覆盖官方鲸鱼（负优先级，lowest renders）；
		 * 留空时不注册（回退官方鲸鱼），值为 none 时渲染空（隐藏）。
		 * 图标不可被选中/拖拽。
		 * @param props - 插槽渲染参数 { size } 与框架共享。
		 * @returns 自定义图标元素。
		 */
		/**
		 * 侧边栏左上角品牌文字插槽贡献（sidebar.brand.name）：
		 * 以自定义 Emoji / 文字替换官方 “DeepSeek Harness” 字标（负优先级，lowest renders）；
		 * 留空时不注册（回退官方字标），值为 none 时渲染空（隐藏）。
		 * 文字不可被选中。
		 * @returns 自定义品牌文字元素。
		 */
		function SidebarBrandName() {
			const text = currentAppName;
			if (!text || text === ICON_HIDDEN) {
				return null;
			}
			return (0, react_jsx_runtime.jsx)("span", {
				style: {
					userSelect: "none",
					whiteSpace: "nowrap",
					fontSize: 14,
					fontWeight: 600,
					color: "inherit",
					lineHeight: 1
				},
				children: text
			});
		}
		function SidebarBrandMark(props) {
			return (0, react_jsx_runtime.jsx)(IconMark, {
				icon: currentAppIcon,
				size: props.size || 24
			});
		}
		/**
		 * 定位首页欢迎标题元素。
		 * 官方 HeroShell 结构（dsh-client-ui-conversation）：
		 * div.headline > span.titleGroup > span（裸文本 = 主标题） + span.previewBadge（预览版徽章）。
		 * 标题不是 h1；先按语义类（CSS Module 保留 titleGroup 后缀）找标题组内的裸文本 span，
		 * 结构定位失败即视为非欢迎页，不做全文档文本遍历（性能考虑）。
		 * @returns 标题元素，或 null（非欢迎页）。
		 */
		function findHeadline() {
			const group = document.querySelector('[class*="titleGroup"]');
			if (group) {
				for (const s of group.querySelectorAll("span")) {
					if (!s.className && s.childElementCount === 0) {
						return s;
					}
				}
			}
			// 结构定位失败即视为非欢迎页：不再做全文档文本遍历（大型活动 DOM 下每次遍历成本过高，
			// 高频 DOM 变化时会导致渲染进程 CPU 占满、界面卡死）。
			return null;
		}
		/**
		 * 替换首页欢迎文字：结构定位命中即应用最新设置值（首页守卫由 findHeadline 承担）。
		 * 预览版徽章为独立元素，保留不动。
		 * @param values - 设置中的生效值。
		 */
		function applyWelcome(values) {
			const headline = findHeadline();
			if (!headline) {
				return;
			}
			// findHeadline 结构定位（titleGroup）成功即欢迎页特征：无论当前文本是什么
			// （原始文案 / 已替换的默认文案 / 用户自定义值）都应用最新值，
			// 解决「启动早期 mirror 未加载先用默认值替换、此后设置值到达不再更新」的时序问题。
			// 文本回退路径已要求元素文本恰为原始主标题，非欢迎页不会被误改。
			headline.textContent = values.title;
			// 副标题（最佳努力）：仅在标题所在标题组内查找仍为英文主标题原文的独立元素；
			// 当前 DSH hero 无独立副标题（"Into the Unknown" 是英文 locale 的主标题），无匹配则跳过。
			// 范围限定在标题父容器，避免每次全文档遍历。
			const group = headline.parentElement;
			if (group) {
				for (const el of group.querySelectorAll("span, div, p")) {
					if (el === headline) {
						continue;
					}
					if (el.textContent.trim() === "Into the Unknown") {
						el.textContent = values.subtitle;
						break;
					}
				}
			}
		}
		/**
		 * 浏览器半侧挂载点：注册设置分区、首页替换与品牌图标插槽。
		 * @param ctx - 浏览器插件上下文。
		 */
		function apply(ctx) {
			const t = ctx.locale.bind(NS);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "custom-welcome: dictionaries");
			const controller = new WelcomeFormController(ctx.configForms.get(ENTRY_ID));
			ctx.effect(() => () => {
				controller.dispose();
			}, "custom-welcome: form subscription");
			// 首页替换：设置值变化或 DOM 重渲染（SPA 路由切换）时重新应用
			ctx.effect(() => {
				// rAF 节流：聊天/滚动等场景 DOM 高频增删会密集触发 observer，
				// 直接跑 run 会反复做 DOM 查询拖垮渲染进程；合并到每帧最多执行一次。
				let pending = false;
				const run = () => {
					if (pending) {
						return;
					}
					pending = true;
					requestAnimationFrame(() => {
						pending = false;
						applyWelcome(controller.values());
					});
				};
				const observer = new MutationObserver(run);
				observer.observe(document.documentElement, {
					childList: true,
					subtree: true
				});
				const unsubscribe = controller.scope.subscribe(run);
				run();
				return () => {
					unsubscribe();
					observer.disconnect();
				};
			}, "custom-welcome: homepage replacement");
			// 欢迎页鲸鱼 → 自定义图标（conversation.hero.brand.mark 插槽）
			ctx.effect(() => {
				let dispose = null;
				const sync = () => {
					const icon = controller.values().icon;
					if (icon && !dispose) {
						currentIcon = icon;
						dispose = ctx.slots.inject("conversation.hero.brand.mark", () => ctx.slots.register({
							name: "conversation.hero.brand.mark",
							locale: NS
						}, HeroBrandMark));
					} else if (!icon && dispose) {
						dispose();
						dispose = null;
						currentIcon = "";
					}
				};
				const unsubscribe = controller.scope.subscribe(sync);
				sync();
				return () => {
					unsubscribe();
					if (dispose) {
						dispose();
					}
				};
			}, "custom-welcome: hero brand mark");
			// 侧边栏左上角品牌图标 → 自定义图标（sidebar.brand.mark 插槽，负优先级覆盖官方鲸鱼）
			ctx.effect(() => {
				let dispose = null;
				const sync = () => {
					const icon = controller.values().appIcon;
					if (icon && !dispose) {
						currentAppIcon = icon;
						dispose = ctx.slots.inject("sidebar.brand.mark", () => ctx.slots.register({
							name: "sidebar.brand.mark",
							priority: -100,
							locale: NS
						}, SidebarBrandMark));
					} else if (!icon && dispose) {
						dispose();
						dispose = null;
						currentAppIcon = "";
					}
				};
				const unsubscribe = controller.scope.subscribe(sync);
				sync();
				return () => {
					unsubscribe();
					if (dispose) {
						dispose();
					}
				};
			}, "custom-welcome: sidebar brand mark");
			// 侧边栏左上角品牌文字 → 自定义文字（sidebar.brand.name 插槽，负优先级覆盖官方 “DeepSeek Harness”）
			ctx.effect(() => {
				let dispose = null;
				const sync = () => {
					const name = controller.values().appName;
					if (name && !dispose) {
						currentAppName = name;
						dispose = ctx.slots.inject("sidebar.brand.name", () => ctx.slots.register({
							name: "sidebar.brand.name",
							priority: -100,
							locale: NS
						}, SidebarBrandName));
					} else if (!name && dispose) {
						dispose();
						dispose = null;
						currentAppName = "";
					}
				};
				const unsubscribe = controller.scope.subscribe(sync);
				sync();
				return () => {
					unsubscribe();
					if (dispose) {
						dispose();
					}
				};
			}, "custom-welcome: sidebar brand name");
			// 窗口标题：document.title 守卫（桌面窗口/任务栏标题跟随；SPA 重设后自动恢复）
			ctx.effect(() => {
				const applyTitle = () => {
					const title = controller.values().windowTitle;
					if (!title) return;
					if (document.title !== title) document.title = title;
				};
				if (!document.querySelector("title")) {
					const tag = document.createElement("title");
					document.head.appendChild(tag);
				}
				const observer = new MutationObserver(applyTitle);
				observer.observe(document.head, { childList: true, subtree: true, characterData: true });
				const unsubscribe = controller.scope.subscribe(applyTitle);
				applyTitle();
				return () => {
					unsubscribe();
					observer.disconnect();
				};
			}, "custom-welcome: window title");
			// 设置 → 「自定义欢迎文字」分区
			ctx.effect(() => ctx.configForms.whileServed([ENTRY_ID], () => ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "custom-welcome",
				order: 20,
				label: () => t("section"),
				locale: NS,
				inject: () => controller.inject()
			}, WelcomeSection))), "custom-welcome: settings section");
		}
		//#endregion
		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
