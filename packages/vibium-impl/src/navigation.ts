import type { NavigationHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { VibiumContext } from "./context.js";

export function createNavigationHandlers(
	ctx: VibiumContext,
): NavigationHandlers {
	return {
		async navigateTo({ url }) {
			await ctx.getPage().go(url);
		},
		async getCurrentUrl() {
			return { url: await ctx.getPage().url() };
		},
		async getTitle() {
			return { title: await ctx.getPage().title() };
		},
		async getPageSource() {
			return { source: await ctx.getPage().content() };
		},
		async back() {
			await ctx.getPage().back();
		},
		async forward() {
			await ctx.getPage().forward();
		},
		async refresh() {
			await ctx.getPage().reload();
		},
	};
}
