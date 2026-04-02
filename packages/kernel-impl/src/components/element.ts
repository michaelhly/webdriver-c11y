import type { ElementHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { NoSuchElementError } from "@michaelhly.webdriver-c11y/schemas";
import {
  EID_ATTR,
  type KernelContext,
  esc,
  exec,
  toPlaywrightSelector,
} from "../context.js";

/** Playwright locator expression for an element tagged with the given ID. */
function loc(elementId: string): string {
  return `page.locator('[${EID_ATTR}=${esc(elementId)}]')`;
}

export function createElementHandlers(ctx: KernelContext): ElementHandlers {
  return {
    async findElement({ locator, fromElement }) {
      const selector = toPlaywrightSelector(locator.using, locator.value);
      const eid = ctx.nextElementId();
      const fromSelector = fromElement
        ? `[${EID_ATTR}=${esc(fromElement)}]`
        : null;

      const found = await exec<boolean>(
        ctx,
        `
        const root = ${fromSelector ? `page.locator(${esc(fromSelector)})` : "page"};
        const el = root.locator(${esc(selector)}).first();
        const count = await el.count();
        if (count === 0) return false;
        await el.evaluate((node, id) => node.setAttribute(${esc(EID_ATTR)}, id), ${esc(eid)});
        return true;
      `,
      );

      if (!found) {
        throw new NoSuchElementError(
          `No element found for ${locator.using}=${locator.value}`,
        );
      }
      return { elementId: eid };
    },

    async findElements({ locator, fromElement }) {
      const selector = toPlaywrightSelector(locator.using, locator.value);
      const prefix = ctx.nextElementId();
      const fromSelector = fromElement
        ? `[${EID_ATTR}=${esc(fromElement)}]`
        : null;

      const ids = await exec<string[]>(
        ctx,
        `
        const root = ${fromSelector ? `page.locator(${esc(fromSelector)})` : "page"};
        const els = root.locator(${esc(selector)});
        const count = await els.count();
        const ids = [];
        for (let i = 0; i < count; i++) {
          const id = ${esc(prefix)} + '-' + i;
          await els.nth(i).evaluate((node, id) => node.setAttribute(${esc(EID_ATTR)}, id), id);
          ids.push(id);
        }
        return ids;
      `,
      );

      return { elementIds: ids };
    },

    async getActiveElement() {
      const eid = ctx.nextElementId();
      await exec(
        ctx,
        `
        await page.evaluate((attr, id) => {
          const el = document.activeElement;
          if (el) el.setAttribute(attr, id);
        }, ${esc(EID_ATTR)}, ${esc(eid)});
        return undefined;
      `,
      );
      return { elementId: eid };
    },

    async elementClick({ elementId }) {
      await exec(ctx, `await ${loc(elementId)}.click(); return undefined;`);
    },

    async elementSendKeys({ elementId, text }) {
      await exec(
        ctx,
        `await ${loc(elementId)}.pressSequentially(${esc(text)}); return undefined;`,
      );
    },

    async elementClear({ elementId }) {
      await exec(ctx, `await ${loc(elementId)}.clear(); return undefined;`);
    },

    async elementGetText({ elementId }) {
      const text = await exec<string>(
        ctx,
        `return await ${loc(elementId)}.innerText();`,
      );
      return { text };
    },

    async elementGetAttribute({ elementId, name }) {
      const value = await exec<string | null>(
        ctx,
        `return await ${loc(elementId)}.getAttribute(${esc(name)});`,
      );
      return { value };
    },

    async elementGetProperty({ elementId, name }) {
      const value = await exec<unknown>(
        ctx,
        `return await ${loc(elementId)}.evaluate((el, prop) => (el as any)[prop], ${esc(name)});`,
      );
      return { value };
    },

    async elementGetCssValue({ elementId, propertyName }) {
      const value = await exec<string>(
        ctx,
        `return await ${loc(elementId)}.evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), ${esc(propertyName)});`,
      );
      return { value };
    },

    async elementGetTagName({ elementId }) {
      const tagName = await exec<string>(
        ctx,
        `return await ${loc(elementId)}.evaluate(el => el.tagName.toLowerCase());`,
      );
      return { tagName };
    },

    async elementGetRect({ elementId }) {
      return await exec(
        ctx,
        `
        const box = await ${loc(elementId)}.boundingBox();
        return box ? { x: box.x, y: box.y, width: box.width, height: box.height }
                   : { x: 0, y: 0, width: 0, height: 0 };
      `,
      );
    },

    async elementIsDisplayed({ elementId }) {
      const value = await exec<boolean>(
        ctx,
        `return await ${loc(elementId)}.isVisible();`,
      );
      return { value };
    },

    async elementIsEnabled({ elementId }) {
      const value = await exec<boolean>(
        ctx,
        `return await ${loc(elementId)}.isEnabled();`,
      );
      return { value };
    },

    async elementIsSelected({ elementId }) {
      const value = await exec<boolean>(
        ctx,
        `return await ${loc(elementId)}.isChecked();`,
      );
      return { value };
    },

    async elementGetComputedRole({ elementId }) {
      const role = await exec<string>(
        ctx,
        `return await ${loc(elementId)}.evaluate(el => el.computedRole ?? el.getAttribute('role') ?? '');`,
      );
      return { role };
    },

    async elementGetComputedLabel({ elementId }) {
      const label = await exec<string>(
        ctx,
        `return await ${loc(elementId)}.evaluate(el => (el as any).computedLabel ?? el.getAttribute('aria-label') ?? '');`,
      );
      return { label };
    },

    async elementGetShadowRoot({ elementId }) {
      const srId = ctx.nextShadowRootId();
      const found = await exec<boolean>(
        ctx,
        `
        return await ${loc(elementId)}.evaluate((el, args) => {
          const sr = el.shadowRoot;
          if (!sr) return false;
          (el as any).__kernel_shadow_root_id = args.srId;
          return true;
        }, { srId: ${esc(srId)} });
      `,
      );
      if (!found) {
        throw new NoSuchElementError("Element does not have a shadow root");
      }
      return { shadowRootId: srId };
    },

    async findElementFromShadowRoot({ shadowRootId, locator }) {
      const selector = toPlaywrightSelector(locator.using, locator.value);
      const eid = ctx.nextElementId();
      const found = await exec<boolean>(
        ctx,
        `
        const host = await page.evaluateHandle((srId) => {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            if ((el as any).__kernel_shadow_root_id === srId && el.shadowRoot) {
              return el.shadowRoot;
            }
          }
          return null;
        }, ${esc(shadowRootId)});
        if (!host) return false;
        const el = page.locator(${esc(selector)}).first();
        const count = await el.count();
        if (count === 0) return false;
        await el.evaluate((node, id) => node.setAttribute(${esc(EID_ATTR)}, id), ${esc(eid)});
        return true;
      `,
      );
      if (!found) {
        throw new NoSuchElementError(
          `No element found in shadow root for ${locator.using}=${locator.value}`,
        );
      }
      return { elementId: eid };
    },

    async findElementsFromShadowRoot({ shadowRootId, locator }) {
      const selector = toPlaywrightSelector(locator.using, locator.value);
      const prefix = ctx.nextElementId();
      const ids = await exec<string[]>(
        ctx,
        `
        const host = await page.evaluateHandle((srId) => {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            if ((el as any).__kernel_shadow_root_id === srId && el.shadowRoot) {
              return el.shadowRoot;
            }
          }
          return null;
        }, ${esc(shadowRootId)});
        const els = page.locator(${esc(selector)});
        const count = await els.count();
        const ids = [];
        for (let i = 0; i < count; i++) {
          const id = ${esc(prefix)} + '-' + i;
          await els.nth(i).evaluate((node, id) => node.setAttribute(${esc(EID_ATTR)}, id), id);
          ids.push(id);
        }
        return ids;
      `,
      );
      return { elementIds: ids };
    },

    async elementTakeScreenshot({ elementId }) {
      const data = await exec<string>(
        ctx,
        `
        const buf = await ${loc(elementId)}.screenshot();
        return buf.toString('base64');
      `,
      );
      return { data };
    },
  };
}
