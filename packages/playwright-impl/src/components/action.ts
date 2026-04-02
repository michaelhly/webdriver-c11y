import type { ActionHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";

export function createActionHandlers(ctx: PlaywrightContext): ActionHandlers {
  return {
    async performActions({ actions }) {
      const page = ctx.getPage();
      for (const sequence of actions) {
        for (const action of sequence.actions) {
          const a = action as Record<string, unknown>;
          switch (sequence.type) {
            case "pointer":
              await handlePointerAction(page, a);
              break;
            case "key":
              await handleKeyAction(page, a);
              break;
            case "wheel":
              await handleWheelAction(page, a);
              break;
            case "none":
              if (a.type === "pause" && typeof a.duration === "number") {
                await new Promise((r) => setTimeout(r, a.duration as number));
              }
              break;
          }
        }
      }
    },
    async releaseActions() {
      // No-op: Playwright automatically releases input state
    },
  };
}

async function handlePointerAction(
  page: import("playwright").Page,
  action: Record<string, unknown>,
): Promise<void> {
  switch (action.type) {
    case "pointerMove":
      await page.mouse.move(
        (action.x as number) ?? 0,
        (action.y as number) ?? 0,
      );
      break;
    case "pointerDown":
      await page.mouse.down({
        button: action.button === 2 ? "right" : "left",
      });
      break;
    case "pointerUp":
      await page.mouse.up({
        button: action.button === 2 ? "right" : "left",
      });
      break;
    case "pause":
      if (typeof action.duration === "number") {
        await new Promise((r) => setTimeout(r, action.duration as number));
      }
      break;
  }
}

async function handleKeyAction(
  page: import("playwright").Page,
  action: Record<string, unknown>,
): Promise<void> {
  const value = action.value as string | undefined;
  switch (action.type) {
    case "keyDown":
      if (value) await page.keyboard.down(value);
      break;
    case "keyUp":
      if (value) await page.keyboard.up(value);
      break;
    case "pause":
      if (typeof action.duration === "number") {
        await new Promise((r) => setTimeout(r, action.duration as number));
      }
      break;
  }
}

async function handleWheelAction(
  page: import("playwright").Page,
  action: Record<string, unknown>,
): Promise<void> {
  switch (action.type) {
    case "scroll":
      await page.mouse.wheel(
        (action.deltaX as number) ?? 0,
        (action.deltaY as number) ?? 0,
      );
      break;
    case "pause":
      if (typeof action.duration === "number") {
        await new Promise((r) => setTimeout(r, action.duration as number));
      }
      break;
  }
}
