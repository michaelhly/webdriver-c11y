import type {
  ElementHandlers,
  LocatorStrategy,
} from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { Locator, StagehandContext } from "./context.js";
import { getLocator, storeElement } from "./context.js";

function toSelector(using: LocatorStrategy, value: string): string {
  switch (using) {
    case "css":
      return value;
    case "id":
      return `#${value}`;
    case "name":
      return `[name="${value}"]`;
    case "tag-name":
      return value;
    case "class-name":
      return `.${value}`;
    case "placeholder":
      return `[placeholder="${value}"]`;
    case "role":
      return `[role="${value}"]`;
    case "label":
      return `[aria-label="${value}"]`;
    case "xpath":
      return `xpath=${value}`;
    case "link-text":
      return `xpath=//a[text()="${value}"]`;
    case "partial-link-text":
      return `xpath=//a[contains(text(),"${value}")]`;
    case "text":
      return `xpath=//*[contains(text(),"${value}")]`;
    default:
      throw new UnsupportedOperationError(
        `Unsupported locator strategy: ${using as string}`,
      );
  }
}

export function createElementHandlers(ctx: StagehandContext): ElementHandlers {
  return {
    async findElement({ locator: loc }) {
      const selector = toSelector(loc.using, loc.value);
      const locator = ctx.getPage().locator(selector).first();
      return { elementId: storeElement(ctx, locator) };
    },
    async findElements({ locator: loc }) {
      const selector = toSelector(loc.using, loc.value);
      const count = await ctx.getPage().locator(selector).count();
      const ids: string[] = [];
      for (let i = 0; i < count; i++) {
        const locator = ctx.getPage().locator(selector).nth(i);
        ids.push(storeElement(ctx, locator));
      }
      return { elementIds: ids };
    },
    async getActiveElement() {
      // Focus the active element and create a locator via evaluate
      const selector = await ctx.getPage().evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return "body";
        if (el.id) return `#${el.id}`;
        return "body";
      });
      const locator = ctx.getPage().locator(selector).first();
      return { elementId: storeElement(ctx, locator) };
    },
    async elementClick({ elementId }) {
      await getLocator(ctx, elementId).click();
    },
    async elementSendKeys({ elementId, text }) {
      await getLocator(ctx, elementId).type(text);
    },
    async elementClear({ elementId }) {
      await getLocator(ctx, elementId).fill("");
    },
    async elementGetText({ elementId }) {
      const text = await getLocator(ctx, elementId).textContent();
      return { text: text ?? "" };
    },
    async elementGetAttribute({ elementId, name }) {
      const locator = getLocator(ctx, elementId);
      const value = await ctx
        .getPage()
        .evaluate(
          ({ sel, attr }: { sel: string; attr: string }) =>
            document.querySelector(sel)?.getAttribute(attr) ?? null,
          { sel: await resolveSelector(locator), attr: name },
        );
      return { value };
    },
    async elementGetProperty({ elementId, name }) {
      const locator = getLocator(ctx, elementId);
      const value = await ctx.getPage().evaluate(
        ({ sel, prop }: { sel: string; prop: string }) => {
          const el = document.querySelector(sel);
          if (!el) return undefined;
          return (el as unknown as Record<string, unknown>)[prop];
        },
        { sel: await resolveSelector(locator), prop: name },
      );
      return { value };
    },
    async elementGetCssValue({ elementId, propertyName }) {
      const locator = getLocator(ctx, elementId);
      const value = await ctx.getPage().evaluate(
        ({ sel, prop }: { sel: string; prop: string }) => {
          const el = document.querySelector(sel);
          if (!el) return "";
          return getComputedStyle(el).getPropertyValue(prop);
        },
        { sel: await resolveSelector(locator), prop: propertyName },
      );
      return { value };
    },
    async elementGetTagName({ elementId }) {
      const locator = getLocator(ctx, elementId);
      const tagName = await ctx
        .getPage()
        .evaluate(
          (sel: string) =>
            document.querySelector(sel)?.tagName.toLowerCase() ?? "",
          await resolveSelector(locator),
        );
      return { tagName };
    },
    async elementGetRect({ elementId }) {
      const locator = getLocator(ctx, elementId);
      const rect = await ctx.getPage().evaluate(
        (sel: string) => {
          const el = document.querySelector(sel);
          if (!el) return { x: 0, y: 0, width: 0, height: 0 };
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        },
        await resolveSelector(locator),
      );
      return rect;
    },
    async elementIsDisplayed({ elementId }) {
      return { value: await getLocator(ctx, elementId).isVisible() };
    },
    async elementIsEnabled({ elementId }) {
      const locator = getLocator(ctx, elementId);
      const value = await ctx
        .getPage()
        .evaluate(
          (sel: string) =>
            !(document.querySelector(sel) as HTMLElement)?.hasAttribute(
              "disabled",
            ),
          await resolveSelector(locator),
        );
      return { value };
    },
    async elementIsSelected({ elementId }) {
      const locator = getLocator(ctx, elementId);
      return { value: await locator.isChecked() };
    },
    async elementGetComputedRole({ elementId }) {
      const locator = getLocator(ctx, elementId);
      const role = await ctx
        .getPage()
        .evaluate(
          (sel: string) =>
            document.querySelector(sel)?.getAttribute("role") ?? "",
          await resolveSelector(locator),
        );
      return { role };
    },
    async elementGetComputedLabel({ elementId }) {
      const locator = getLocator(ctx, elementId);
      const label = await ctx
        .getPage()
        .evaluate(
          (sel: string) =>
            document.querySelector(sel)?.getAttribute("aria-label") ?? "",
          await resolveSelector(locator),
        );
      return { label };
    },
    async elementGetShadowRoot() {
      throw new UnsupportedOperationError(
        "Shadow root access not supported in Stagehand",
      );
    },
    async findElementFromShadowRoot() {
      throw new UnsupportedOperationError(
        "Shadow root access not supported in Stagehand",
      );
    },
    async findElementsFromShadowRoot() {
      throw new UnsupportedOperationError(
        "Shadow root access not supported in Stagehand",
      );
    },
    async elementTakeScreenshot({ elementId }) {
      const locator = getLocator(ctx, elementId);
      const centroid = await locator.centroid();
      // Use CDP to capture element screenshot via its coordinates
      const buf = await ctx.getPage().screenshot({
        clip: {
          x: centroid.x - 50,
          y: centroid.y - 50,
          width: 100,
          height: 100,
        },
      });
      return { data: buf.toString("base64") };
    },
  };
}

async function resolveSelector(locator: Locator): Promise<string> {
  // Locator stores the CSS selector internally; access it via toString or similar
  // Stagehand Locator is created with a selector string - extract it
  const str = String(locator);
  // Fallback: the locator's string representation typically contains the selector
  return str;
}
