import type { ElementHandlers } from "@michaelhly.webdriver-c11y/schemas";
import {
  NoSuchElementError,
} from "@michaelhly.webdriver-c11y/schemas";
import {
  EID_ATTR,
  type KernelContext,
  elementCenter,
  esc,
  exec,
  getElementRect,
  toPlaywrightSelector,
} from "./context.js";

export function createElementHandlers(ctx: KernelContext): ElementHandlers {
  const computer = () => ctx.getClient().browsers.computer;
  const sid = () => ctx.getSessionId();

  return {
    // -- DOM queries (playwright) ----------------------------------------

    async findElement({ locator, fromElement }) {
      const selector = toPlaywrightSelector(locator.using, locator.value);
      const eid = ctx.nextElementId();
      const fromSelector = fromElement
        ? `[${EID_ATTR}=${esc(fromElement)}]`
        : null;

      const found = await exec<boolean>(ctx, `
        const root = ${fromSelector ? `page.locator(${esc(fromSelector)})` : "page"};
        const el = root.locator(${esc(selector)}).first();
        const count = await el.count();
        if (count === 0) return false;
        await el.evaluate((node, id) => node.setAttribute(${esc(EID_ATTR)}, id), ${esc(eid)});
        return true;
      `);

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

      const ids = await exec<string[]>(ctx, `
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
      `);

      return { elementIds: ids };
    },

    async getActiveElement() {
      const eid = ctx.nextElementId();
      await exec(ctx, `
        await page.evaluate((attr, id) => {
          const el = document.activeElement;
          if (el) el.setAttribute(attr, id);
        }, ${esc(EID_ATTR)}, ${esc(eid)});
        return undefined;
      `);
      return { elementId: eid };
    },

    // -- Input operations (computer API) ---------------------------------

    async elementClick({ elementId }) {
      const rect = await getElementRect(ctx, elementId);
      const { x, y } = elementCenter(rect);
      await computer().clickMouse(sid(), { x, y });
    },

    async elementSendKeys({ elementId, text }) {
      const rect = await getElementRect(ctx, elementId);
      const { x, y } = elementCenter(rect);
      await computer().clickMouse(sid(), { x, y });
      await computer().typeText(sid(), { text });
    },

    async elementClear({ elementId }) {
      const rect = await getElementRect(ctx, elementId);
      const { x, y } = elementCenter(rect);
      await computer().clickMouse(sid(), { x, y });
      await computer().pressKey(sid(), { keys: ["ctrl+a"] });
      await computer().pressKey(sid(), { keys: ["BackSpace"] });
    },

    // -- DOM property reads (playwright) ---------------------------------

    async elementGetText({ elementId }) {
      const text = await exec<string>(
        ctx,
        `return await page.locator('[${EID_ATTR}=${esc(elementId)}]').innerText();`,
      );
      return { text };
    },

    async elementGetAttribute({ elementId, name }) {
      const value = await exec<string | null>(
        ctx,
        `return await page.locator('[${EID_ATTR}=${esc(elementId)}]').getAttribute(${esc(name)});`,
      );
      return { value };
    },

    async elementGetProperty({ elementId, name }) {
      const value = await exec<unknown>(ctx, `
        return await page.locator('[${EID_ATTR}=${esc(elementId)}]').evaluate(
          (el, prop) => (el as any)[prop], ${esc(name)}
        );
      `);
      return { value };
    },

    async elementGetCssValue({ elementId, propertyName }) {
      const value = await exec<string>(ctx, `
        return await page.locator('[${EID_ATTR}=${esc(elementId)}]').evaluate(
          (el, prop) => getComputedStyle(el).getPropertyValue(prop), ${esc(propertyName)}
        );
      `);
      return { value };
    },

    async elementGetTagName({ elementId }) {
      const tagName = await exec<string>(ctx, `
        return await page.locator('[${EID_ATTR}=${esc(elementId)}]').evaluate(
          el => el.tagName.toLowerCase()
        );
      `);
      return { tagName };
    },

    async elementGetRect({ elementId }) {
      return await getElementRect(ctx, elementId);
    },

    async elementIsDisplayed({ elementId }) {
      const value = await exec<boolean>(
        ctx,
        `return await page.locator('[${EID_ATTR}=${esc(elementId)}]').isVisible();`,
      );
      return { value };
    },

    async elementIsEnabled({ elementId }) {
      const value = await exec<boolean>(
        ctx,
        `return await page.locator('[${EID_ATTR}=${esc(elementId)}]').isEnabled();`,
      );
      return { value };
    },

    async elementIsSelected({ elementId }) {
      const value = await exec<boolean>(
        ctx,
        `return await page.locator('[${EID_ATTR}=${esc(elementId)}]').isChecked();`,
      );
      return { value };
    },

    async elementGetComputedRole({ elementId }) {
      const role = await exec<string>(ctx, `
        return await page.locator('[${EID_ATTR}=${esc(elementId)}]').evaluate(
          el => el.computedRole ?? el.getAttribute('role') ?? ''
        );
      `);
      return { role };
    },

    async elementGetComputedLabel({ elementId }) {
      const label = await exec<string>(ctx, `
        return await page.locator('[${EID_ATTR}=${esc(elementId)}]').evaluate(
          el => (el as any).computedLabel ?? el.getAttribute('aria-label') ?? ''
        );
      `);
      return { label };
    },

    async elementGetShadowRoot({ elementId }) {
      const srId = ctx.nextShadowRootId();
      const found = await exec<boolean>(ctx, `
        return await page.locator('[${EID_ATTR}=${esc(elementId)}]').evaluate(
          (el, args) => {
            const sr = el.shadowRoot;
            if (!sr) return false;
            (el as any).__kernel_shadow_root_id = args.srId;
            return true;
          }, { srId: ${esc(srId)} }
        );
      `);
      if (!found) {
        throw new NoSuchElementError("Element does not have a shadow root");
      }
      return { shadowRootId: srId };
    },

    async findElementFromShadowRoot({ shadowRootId, locator }) {
      const selector = toPlaywrightSelector(locator.using, locator.value);
      const eid = ctx.nextElementId();
      const found = await exec<boolean>(ctx, `
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
      `);
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
      const ids = await exec<string[]>(ctx, `
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
      `);
      return { elementIds: ids };
    },

    // -- Element screenshot (computer API) -------------------------------

    async elementTakeScreenshot({ elementId }) {
      const rect = await getElementRect(ctx, elementId);
      const response = await computer().captureScreenshot(sid(), {
        region: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      });
      const buffer = await response.arrayBuffer();
      return { data: Buffer.from(buffer).toString("base64") };
    },
  };
}
