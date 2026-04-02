import type { ElementHandlers, Rect } from "@michaelhly.webdriver-c11y/schemas";
import { NoSuchElementError } from "@michaelhly.webdriver-c11y/schemas";
import {
  EID_ATTR,
  type KernelContext,
  toPlaywrightSelector,
} from "./context.js";
import { evaluate } from "../eval.js";

/** Selector string for finding an element by its kernel element ID. */
function eidSelector(elementId: string): string {
  return `[${EID_ATTR}="${elementId}"]`;
}

export function createElementHandlers(ctx: KernelContext): ElementHandlers {
  return {
    async findElement({ locator, fromElement }) {
      const selector = toPlaywrightSelector(locator.using, locator.value);
      const eid = ctx.nextElementId();

      const found = await evaluate(
        ctx,
        async (page, _context, args) => {
          const root = args.fromSelector
            ? page.locator(args.fromSelector)
            : page;
          const el = root.locator(args.selector).first();
          if ((await el.count()) === 0) return false;
          await el.evaluate(
            (node, { attr, id }) => node.setAttribute(attr, id),
            { attr: args.eidAttr, id: args.eid },
          );
          return true;
        },
        {
          selector,
          eid,
          eidAttr: EID_ATTR,
          fromSelector: fromElement ? eidSelector(fromElement) : null,
        },
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

      const ids = await evaluate(
        ctx,
        async (page, _context, args) => {
          const root = args.fromSelector
            ? page.locator(args.fromSelector)
            : page;
          const els = root.locator(args.selector);
          const count = await els.count();
          const ids: string[] = [];
          for (let i = 0; i < count; i++) {
            const id = `${args.prefix}-${i}`;
            await els
              .nth(i)
              .evaluate((node, { attr, id }) => node.setAttribute(attr, id), {
                attr: args.eidAttr,
                id,
              });
            ids.push(id);
          }
          return ids;
        },
        {
          selector,
          prefix,
          eidAttr: EID_ATTR,
          fromSelector: fromElement ? eidSelector(fromElement) : null,
        },
      );

      return { elementIds: ids };
    },

    async getActiveElement() {
      const eid = ctx.nextElementId();
      await evaluate(
        ctx,
        async (page, _context, args) => {
          await page.evaluate(
            ({ attr, id }) => {
              const el = document.activeElement;
              if (el) el.setAttribute(attr, id);
            },
            { attr: args.eidAttr, id: args.eid },
          );
        },
        { eidAttr: EID_ATTR, eid },
      );
      return { elementId: eid };
    },

    async elementClick({ elementId }) {
      await evaluate(
        ctx,
        async (page, _context, args) => {
          await page.locator(args.selector).click();
        },
        { selector: eidSelector(elementId) },
      );
    },

    async elementSendKeys({ elementId, text }) {
      await evaluate(
        ctx,
        async (page, _context, args) => {
          await page.locator(args.selector).pressSequentially(args.text);
        },
        { selector: eidSelector(elementId), text },
      );
    },

    async elementClear({ elementId }) {
      await evaluate(
        ctx,
        async (page, _context, args) => {
          await page.locator(args.selector).clear();
        },
        { selector: eidSelector(elementId) },
      );
    },

    async elementGetText({ elementId }) {
      const text = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page.locator(args.selector).innerText();
        },
        { selector: eidSelector(elementId) },
      );
      return { text };
    },

    async elementGetAttribute({ elementId, name }) {
      const value = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page.locator(args.selector).getAttribute(args.name);
        },
        { selector: eidSelector(elementId), name },
      );
      return { value };
    },

    async elementGetProperty({ elementId, name }) {
      const value = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page
            .locator(args.selector)
            .evaluate(
              (el, prop) => (el as unknown as Record<string, unknown>)[prop],
              args.name,
            );
        },
        { selector: eidSelector(elementId), name },
      );
      return { value };
    },

    async elementGetCssValue({ elementId, propertyName }) {
      const value = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page
            .locator(args.selector)
            .evaluate(
              (el, prop) => getComputedStyle(el).getPropertyValue(prop),
              args.propertyName,
            );
        },
        { selector: eidSelector(elementId), propertyName },
      );
      return { value };
    },

    async elementGetTagName({ elementId }) {
      const tagName = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page
            .locator(args.selector)
            .evaluate((el) => el.tagName.toLowerCase());
        },
        { selector: eidSelector(elementId) },
      );
      return { tagName };
    },

    async elementGetRect({ elementId }) {
      return await evaluate<{ selector: string }, Rect>(
        ctx,
        async (page, _context, args) => {
          const box = await page.locator(args.selector).boundingBox();
          return box
            ? { x: box.x, y: box.y, width: box.width, height: box.height }
            : { x: 0, y: 0, width: 0, height: 0 };
        },
        { selector: eidSelector(elementId) },
      );
    },

    async elementIsDisplayed({ elementId }) {
      const value = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page.locator(args.selector).isVisible();
        },
        { selector: eidSelector(elementId) },
      );
      return { value };
    },

    async elementIsEnabled({ elementId }) {
      const value = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page.locator(args.selector).isEnabled();
        },
        { selector: eidSelector(elementId) },
      );
      return { value };
    },

    async elementIsSelected({ elementId }) {
      const value = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page.locator(args.selector).isChecked();
        },
        { selector: eidSelector(elementId) },
      );
      return { value };
    },

    async elementGetComputedRole({ elementId }) {
      const role = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page
            .locator(args.selector)
            .evaluate(
              (el) =>
                (el as unknown as { computedRole?: string }).computedRole ??
                el.getAttribute("role") ??
                "",
            );
        },
        { selector: eidSelector(elementId) },
      );
      return { role };
    },

    async elementGetComputedLabel({ elementId }) {
      const label = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page
            .locator(args.selector)
            .evaluate(
              (el) =>
                (el as unknown as { computedLabel?: string }).computedLabel ??
                el.getAttribute("aria-label") ??
                "",
            );
        },
        { selector: eidSelector(elementId) },
      );
      return { label };
    },

    async elementGetShadowRoot({ elementId }) {
      const srId = ctx.nextShadowRootId();
      const found = await evaluate(
        ctx,
        async (page, _context, args) => {
          return page.locator(args.selector).evaluate(
            (el, { srId, attr }) => {
              const sr = el.shadowRoot;
              if (!sr) return false;
              (el as unknown as Record<string, unknown>)[attr] = srId;
              return true;
            },
            { srId: args.srId, attr: "__kernel_shadow_root_id" },
          );
        },
        { selector: eidSelector(elementId), srId },
      );
      if (!found) {
        throw new NoSuchElementError("Element does not have a shadow root");
      }
      return { shadowRootId: srId };
    },

    async findElementFromShadowRoot({ shadowRootId, locator }) {
      const selector = toPlaywrightSelector(locator.using, locator.value);
      const eid = ctx.nextElementId();
      const found = await evaluate(
        ctx,
        async (page, _context, args) => {
          const host = await page.evaluateHandle((srId) => {
            for (const el of document.querySelectorAll("*")) {
              if (
                (el as unknown as Record<string, unknown>)
                  .__kernel_shadow_root_id === srId &&
                el.shadowRoot
              ) {
                return el.shadowRoot;
              }
            }
            return null;
          }, args.shadowRootId);
          if (!host) return false;
          const el = page.locator(args.selector).first();
          if ((await el.count()) === 0) return false;
          await el.evaluate(
            (node, { attr, id }) => node.setAttribute(attr, id),
            { attr: args.eidAttr, id: args.eid },
          );
          return true;
        },
        { shadowRootId, selector, eid, eidAttr: EID_ATTR },
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
      const ids = await evaluate(
        ctx,
        async (page, _context, args) => {
          const host = await page.evaluateHandle((srId) => {
            for (const el of document.querySelectorAll("*")) {
              if (
                (el as unknown as Record<string, unknown>)
                  .__kernel_shadow_root_id === srId &&
                el.shadowRoot
              ) {
                return el.shadowRoot;
              }
            }
            return null;
          }, args.shadowRootId);
          void host;
          const els = page.locator(args.selector);
          const count = await els.count();
          const ids: string[] = [];
          for (let i = 0; i < count; i++) {
            const id = `${args.prefix}-${i}`;
            await els
              .nth(i)
              .evaluate((node, { attr, id }) => node.setAttribute(attr, id), {
                attr: args.eidAttr,
                id,
              });
            ids.push(id);
          }
          return ids;
        },
        { shadowRootId, selector, prefix, eidAttr: EID_ATTR },
      );
      return { elementIds: ids };
    },

    async elementTakeScreenshot({ elementId }) {
      const data = await evaluate(
        ctx,
        async (page, _context, args) => {
          const buf = await page.locator(args.selector).screenshot();
          return buf.toString("base64");
        },
        { selector: eidSelector(elementId) },
      );
      return { data };
    },
  };
}
