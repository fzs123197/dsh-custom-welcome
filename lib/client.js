// dsh-custom-welcome 浏览器半侧（client bundle）
// - 在 DSH 设置中注册「自定义欢迎文字」分区（settings.section）
// - 读取设置中的主标题/副标题，仅在首页替换欢迎文字（SPA 路由切换后自动重新应用）
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
			welcomeSubtitleHint: "主标题下方的英文副标题；留空则使用默认值。",
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
			welcomeSubtitleHint: "English subtitle under the heading; leave blank for the default.",
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
		 * 设置 → 「自定义欢迎文字」分区：两个可编辑文字字段。
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
					primitives.settingsTextField("welcomeSubtitle")
				]);
				this.store = this.form.bind(() => this.projection());
				this.unsubscribe = this.scope.subscribe(() => {});
			}
			projection() {
				return {
					...this.form.shell(),
					welcomeTitle: this.form.field("welcomeTitle"),
					welcomeSubtitle: this.form.field("welcomeSubtitle")
				};
			}
			/** 分区注册注入的 hooks 与表单动作。 */
			inject() {
				return {
					hooks: { welcomeForm: this.store },
					...this.form.actions()
				};
			}
			/** 当前生效的替换值；未配置时回退默认文案。 */
			values() {
				const value = this.scope.getSnapshot().value;
				return {
					title: (value?.welcomeTitle ?? "").trim() || DEFAULT_TITLE,
					subtitle: (value?.welcomeSubtitle ?? "").trim() || DEFAULT_SUBTITLE
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
		/**
		 * 替换首页欢迎文字；仅当欢迎主标题仍为原始文案时执行，避免误改其他页面。
		 * @param values - 设置中的生效值。
		 */
		function applyWelcome(values) {
			const h1 = document.querySelector("h1");
			if (h1 && h1.textContent.trim() === "探索未至之境") {
				h1.textContent = values.title;
			}
			const subEl = document.querySelector("h1 + p");
			if (subEl && subEl.textContent.trim() === "Into the Unknown") {
				subEl.textContent = values.subtitle;
			}
		}
		/**
		 * 浏览器半侧挂载点：注册设置分区并驱动首页替换。
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
