import type { NavigationHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./shared.js";
import { getActivePage } from "./shared.js";

export function createNavigationHandlers(
	ctx: StagehandContext,
): NavigationHandlers {
	return {
		async navigateTo(params) {
			const page = getActivePage(ctx);
			await page.goto(params.url);
		},

		async getCurrentUrl() {
			const page = getActivePage(ctx);
			return { url: page.url() };
		},

		async getTitle() {
			const page = getActivePage(ctx);
			return { title: await page.title() };
		},

		async getPageSource() {
			const page = getActivePage(ctx);
			const source = await page.evaluate(
				() => document.documentElement.outerHTML,
			);
			return { source };
		},

		async back() {
			const page = getActivePage(ctx);
			await page.goBack();
		},

		async forward() {
			const page = getActivePage(ctx);
			await page.goForward();
		},

		async refresh() {
			const page = getActivePage(ctx);
			await page.reload();
		},
	};
}
