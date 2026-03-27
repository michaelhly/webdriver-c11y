import type { BidiInputHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "../context.js";
import { getPage } from "../context.js";

export function createBidiInputHandlers(
  ctx: PlaywrightContext,
): BidiInputHandlers {
  return {
    async inputPerformActions(params) {
      const page = getPage(ctx, params.context);
      for (const sequence of params.actions) {
        for (const action of sequence.actions) {
          const a = action as Record<string, unknown>;
          switch (sequence.type) {
            case "pointer":
              switch (a.type) {
                case "pointerMove":
                  await page.mouse.move(
                    (a.x as number) ?? 0,
                    (a.y as number) ?? 0,
                  );
                  break;
                case "pointerDown":
                  await page.mouse.down({
                    button: a.button === 2 ? "right" : "left",
                  });
                  break;
                case "pointerUp":
                  await page.mouse.up({
                    button: a.button === 2 ? "right" : "left",
                  });
                  break;
              }
              break;
            case "key":
              switch (a.type) {
                case "keyDown":
                  if (a.value) await page.keyboard.down(a.value as string);
                  break;
                case "keyUp":
                  if (a.value) await page.keyboard.up(a.value as string);
                  break;
              }
              break;
            case "wheel":
              if (a.type === "scroll") {
                await page.mouse.wheel(
                  (a.deltaX as number) ?? 0,
                  (a.deltaY as number) ?? 0,
                );
              }
              break;
          }
        }
      }
    },
    async inputReleaseActions(_params) {
      // No-op: Playwright automatically manages input state
    },
    async inputSetFiles(params) {
      if (!params.element) {
        throw new UnsupportedOperationError(
          "inputSetFiles requires an element reference",
        );
      }
      const page = getPage(ctx, params.context);
      // Use Playwright's setInputFiles via a locator or element handle
      const elementId = params.element as string;
      const el = ctx.elements.get(elementId);
      if (el) {
        await el.setInputFiles(params.files);
      } else {
        await page.setInputFiles("input[type=file]", params.files);
      }
    },
  };
}
