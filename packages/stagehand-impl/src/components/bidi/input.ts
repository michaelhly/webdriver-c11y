import type { BidiInputHandlers } from "@michaelhly.webdriver-c11y/schema";
import type { StagehandContext } from "../context.js";

export function createBidiInputHandlers(
	ctx: StagehandContext,
): BidiInputHandlers {
	return {
		async inputPerformActions(params) {
			for (const source of params.actions) {
				for (const action of source.actions) {
					const a = action as Record<string, unknown>;
					switch (source.type) {
						case "pointer":
							if (a.type === "pointerMove") {
								// CDP Input.dispatchMouseEvent for move
								await ctx.getPage().sendCDP("Input.dispatchMouseEvent", {
									type: "mouseMoved",
									x: a.x ?? 0,
									y: a.y ?? 0,
								});
							} else if (a.type === "pointerDown") {
								await ctx.getPage().sendCDP("Input.dispatchMouseEvent", {
									type: "mousePressed",
									x: 0,
									y: 0,
									button: "left",
									clickCount: 1,
								});
							} else if (a.type === "pointerUp") {
								await ctx.getPage().sendCDP("Input.dispatchMouseEvent", {
									type: "mouseReleased",
									x: 0,
									y: 0,
									button: "left",
									clickCount: 1,
								});
							}
							break;
						case "key":
							if (a.type === "keyDown") {
								await ctx.getPage().sendCDP("Input.dispatchKeyEvent", {
									type: "keyDown",
									key: a.value,
								});
							} else if (a.type === "keyUp") {
								await ctx.getPage().sendCDP("Input.dispatchKeyEvent", {
									type: "keyUp",
									key: a.value,
								});
							}
							break;
						case "wheel":
							if (a.type === "scroll") {
								await ctx.getPage().sendCDP("Input.dispatchMouseEvent", {
									type: "mouseWheel",
									x: a.x ?? 0,
									y: a.y ?? 0,
									deltaX: a.deltaX ?? 0,
									deltaY: a.deltaY ?? 0,
								});
							}
							break;
					}
				}
			}
		},
		async inputReleaseActions(_params) {
			// No persistent input state in CDP
		},
		async inputSetFiles(params) {
			const files = params.files;
			// Use CDP DOM.setFileInputFiles
			await ctx.getPage().sendCDP("DOM.setFileInputFiles", {
				files,
				backendNodeId: params.element,
			});
		},
	};
}
