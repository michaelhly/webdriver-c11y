import { NoSuchWindowError } from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./context.js";

export function getActivePage(ctx: StagehandContext) {
	const page = ctx.stagehand.context.activePage();
	if (!page) throw new NoSuchWindowError("No active page");
	return page;
}
