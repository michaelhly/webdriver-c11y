import type { ActionHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { Command, Name } from "selenium-webdriver/lib/command.js";
import type { ClassicContext } from "./context.js";

export function createActionHandlers(ctx: ClassicContext): ActionHandlers {
	return {
		async performActions({ actions }) {
			const cmd = new Command(Name.ACTIONS).setParameter("actions", actions);
			await ctx.getDriver().execute(cmd);
		},
		async releaseActions() {
			const cmd = new Command(Name.CLEAR_ACTIONS);
			await ctx.getDriver().execute(cmd);
		},
	};
}
