import type { ContextHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "./context.js";

export function createContextHandlers(ctx: ClassicContext): ContextHandlers {
	return {
		async getWindowHandle() {
			const handle = await ctx.getDriver().getWindowHandle();
			return { handle };
		},
		async closeWindow() {
			await ctx.getDriver().close();
		},
		async switchToWindow({ handle }) {
			await ctx.getDriver().switchTo().window(handle);
		},
		async getWindowHandles() {
			const handles = await ctx.getDriver().getAllWindowHandles();
			return { handles };
		},
		async newWindow({ type }) {
			const driver = ctx.getDriver();
			const windowType = type === "window" ? "window" : "tab";
			await driver.switchTo().newWindow(windowType);
			const handle = await driver.getWindowHandle();
			return { handle, type: windowType };
		},
		async switchToFrame({ id }) {
			if (id === null || id === undefined) {
				await ctx.getDriver().switchTo().defaultContent();
			} else if (typeof id === "number") {
				await ctx.getDriver().switchTo().frame(id);
			} else {
				await ctx
					.getDriver()
					.switchTo()
					.frame(id as number);
			}
		},
		async switchToParentFrame() {
			await ctx.getDriver().switchTo().parentFrame();
		},
	};
}
