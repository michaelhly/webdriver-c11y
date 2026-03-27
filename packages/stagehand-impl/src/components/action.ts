import type { ActionHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { StagehandContext } from "./context.js";

export function createActionHandlers(_ctx: StagehandContext): ActionHandlers {
	return {
		async performActions(_params) {
			throw new UnsupportedOperationError(
				"W3C action sequences not supported in Stagehand; use page.click/type/keyPress instead",
			);
		},
		async releaseActions() {
			// No-op: Stagehand doesn't maintain input state
		},
	};
}
