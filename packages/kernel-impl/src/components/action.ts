import type { ActionHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { type KernelContext, exec } from "./context.js";

export function createActionHandlers(ctx: KernelContext): ActionHandlers {
  return {
    async performActions({ actions }) {
      await exec(ctx, `
        const actions = ${JSON.stringify(actions)};
        for (const seq of actions) {
          for (const action of seq.actions) {
            if (seq.type === 'pointer') {
              if (action.type === 'pointerMove') {
                await page.mouse.move(action.x ?? 0, action.y ?? 0);
              } else if (action.type === 'pointerDown') {
                await page.mouse.down({ button: action.button === 2 ? 'right' : 'left' });
              } else if (action.type === 'pointerUp') {
                await page.mouse.up({ button: action.button === 2 ? 'right' : 'left' });
              }
            } else if (seq.type === 'key') {
              if (action.type === 'keyDown') {
                await page.keyboard.down(action.value ?? '');
              } else if (action.type === 'keyUp') {
                await page.keyboard.up(action.value ?? '');
              }
            } else if (seq.type === 'wheel') {
              if (action.type === 'scroll') {
                await page.mouse.wheel(action.deltaX ?? 0, action.deltaY ?? 0);
              }
            } else if (seq.type === 'none') {
              if (action.type === 'pause' && action.duration) {
                await new Promise(r => setTimeout(r, action.duration));
              }
            }
          }
        }
        return undefined;
      `);
    },
    async releaseActions() {
      await exec(ctx, `
        await page.keyboard.up('Shift');
        await page.keyboard.up('Control');
        await page.keyboard.up('Alt');
        await page.keyboard.up('Meta');
        await page.mouse.up();
        return undefined;
      `);
    },
  };
}
