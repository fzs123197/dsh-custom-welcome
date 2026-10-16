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
			welcomeIconHint: "留空保留默认鲸鱼；可填 Emoji（如 🚀）、图片链接，或点击「选择本地图片」上传本地图片；大图会自动压缩后保存，用于替换首页欢迎页的鲸鱼图标。",
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
			welcomeIconHint: "Leave blank to keep the default whale; enter an emoji (e.g. 🚀), an image URL, or click \"Choose a local image\" to upload one; large images are compressed automatically before saving.",
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
							marginTop: 6
						},
						children: (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled,
							onClick: () => {
								openLocalIconPicker(props.edit);
							},
							children: t("pickLocalIcon")
						})
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
					primitives.settingsTextField("welcomeIcon")
				]);
				this.store = this.form.bind(() => this.projection());
				this.unsubscribe = this.scope.subscribe(() => {});
			}
			projection() {
				return {
					...this.form.shell(),
					welcomeTitle: this.form.field("welcomeTitle"),
					welcomeSubtitle: this.form.field("welcomeSubtitle"),
					welcomeIcon: this.form.field("welcomeIcon")
				};
			}
			/** 分区注册注入的 hooks 与表单动作。 */
			inject() {
				return {
					hooks: { welcomeForm: this.store },
					...this.form.actions()
				};
			}
			/** 当前生效的替换值；未配置时回退默认文案/默认鲸鱼。 */
			values() {
				const value = this.scope.getSnapshot().value;
				return {
					title: (value?.welcomeTitle ?? "").trim() || DEFAULT_TITLE,
					subtitle: (value?.welcomeSubtitle ?? "").trim() || DEFAULT_SUBTITLE,
					icon: (value?.welcomeIcon ?? "").trim()
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
		function HeroBrandMark(props) {
			const icon = currentIcon;
			const size = props.size || 34;
			if (isImageIcon(icon)) {
				return (0, react_jsx_runtime.jsx)("img", {
					src: icon,
					alt: "",
					width: size,
					height: size,
					style: {
						display: "block",
						objectFit: "contain"
					}
				});
			}
			return (0, react_jsx_runtime.jsx)("span", {
				style: {
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					width: size,
					height: size,
					fontSize: Math.round(size * 0.85),
					lineHeight: 1
				},
				children: icon
			});
		}
		/**
		 * 定位首页欢迎标题元素。
		 * 官方 HeroShell 结构（dsh-client-ui-conversation）：
		 * div.headline > span.titleGroup > span（裸文本 = 主标题） + span.previewBadge（预览版徽章）。
		 * 标题不是 h1；先按语义类（CSS Module 保留 titleGroup 后缀）找标题组内的裸文本 span，
		 * 找不到再回退为「文本恰好等于原始主标题」的任意元素（zh / en）。
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
			const all = document.querySelectorAll("span, div, h1, h2, p, strong, b");
			for (const el of all) {
				const text = el.textContent.trim();
				if (text === "探索未至之境" || text === "Into the Unknown") {
					return el;
				}
			}
			return null;
		}
		/**
		 * 替换首页欢迎文字；仅当标题元素仍为原始文案时执行（即首页守卫），避免误改其他页面。
		 * 预览版徽章为独立元素，保留不动。
		 * @param values - 设置中的生效值。
		 */
		function applyWelcome(values) {
			const headline = findHeadline();
			const original = headline ? headline.textContent.trim() : "";
			if (headline && (original === "探索未至之境" || original === "Into the Unknown")) {
				headline.textContent = values.title;
			}
			// 副标题（最佳努力）：仅替换仍为英文主标题原文的独立元素；
			// 当前 DSH hero 无独立副标题（"Into the Unknown" 是英文 locale 的主标题），无匹配则跳过。
			const all = document.querySelectorAll("span, div, p");
			for (const el of all) {
				if (el === headline) {
					continue;
				}
				if (el.textContent.trim() === "Into the Unknown") {
					el.textContent = values.subtitle;
					break;
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
				const run = () => applyWelcome(controller.values());
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
