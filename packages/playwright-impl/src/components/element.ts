import type {
  ElementHandlers,
  LocatorStrategy,
} from "@michaelhly.webdriver-c11y/schemas";
import {
  NoSuchElementError,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";
import {
  getElement,
  getShadowRoot,
  storeElement,
  storeShadowRoot,
} from "./context.js";

function toSelector(using: LocatorStrategy, value: string): string {
  switch (using) {
    case "css":
      return `css=${value}`;
    case "xpath":
      return `xpath=${value}`;
    case "id":
      return `css=[id="${value}"]`;
    case "name":
      return `css=[name="${value}"]`;
    case "tag-name":
      return `css=${value}`;
    case "class-name":
      return `css=.${value}`;
    case "link-text":
      return `css=a >> text="${value}"`;
    case "partial-link-text":
      return `css=a >> text=${value}`;
    case "text":
      return `text=${value}`;
    case "placeholder":
      return `css=[placeholder="${value}"]`;
    case "role":
      return `role=${value}`;
    case "label":
      return `css=[aria-label="${value}"]`;
    default:
      throw new UnsupportedOperationError(
        `Unsupported locator strategy: ${using as string}`,
      );
  }
}

function toCssSelector(using: LocatorStrategy, value: string): string {
  switch (using) {
    case "css":
      return value;
    case "id":
      return `[id="${value}"]`;
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
    default:
      throw new UnsupportedOperationError(
        `Shadow root search requires a CSS-compatible locator, got: ${using as string}`,
      );
  }
}

export function createElementHandlers(ctx: PlaywrightContext): ElementHandlers {
  return {
    async findElement({ locator, fromElement }) {
      const selector = toSelector(locator.using, locator.value);
      const root = fromElement ? getElement(ctx, fromElement) : ctx.getPage();
      const el = await root.$(selector);
      if (!el)
        throw new NoSuchElementError(
          `Element not found: ${locator.using}=${locator.value}`,
        );
      return { elementId: storeElement(ctx, el) };
    },
    async findElements({ locator, fromElement }) {
      const selector = toSelector(locator.using, locator.value);
      const root = fromElement ? getElement(ctx, fromElement) : ctx.getPage();
      const els = await root.$$(selector);
      return { elementIds: els.map((el) => storeElement(ctx, el)) };
    },
    async getActiveElement() {
      const handle = await ctx
        .getPage()
        .evaluateHandle(() => document.activeElement);
      const el = handle.asElement();
      if (!el) throw new NoSuchElementError("No active element found");
      return { elementId: storeElement(ctx, el) };
    },
    async elementClick({ elementId }) {
      await getElement(ctx, elementId).click();
    },
    async elementSendKeys({ elementId, text }) {
      await getElement(ctx, elementId).type(text);
    },
    async elementClear({ elementId }) {
      await getElement(ctx, elementId).fill("");
    },
    async elementGetText({ elementId }) {
      const text = await getElement(ctx, elementId).innerText();
      return { text };
    },
    async elementGetAttribute({ elementId, name }) {
      const val = await getElement(ctx, elementId).getAttribute(name);
      return { value: val };
    },
    async elementGetProperty({ elementId, name }) {
      const el = getElement(ctx, elementId);
      const val = await el.evaluate(
        (e, prop) => (e as unknown as Record<string, unknown>)[prop],
        name,
      );
      return { value: val };
    },
    async elementGetCssValue({ elementId, propertyName }) {
      const el = getElement(ctx, elementId);
      const value = await el.evaluate(
        (e, prop) =>
          globalThis
            .getComputedStyle(e as unknown as Element)
            .getPropertyValue(prop),
        propertyName,
      );
      return { value };
    },
    async elementGetTagName({ elementId }) {
      const el = getElement(ctx, elementId);
      const tagName = await el.evaluate((e) =>
        (e as unknown as Element).tagName.toLowerCase(),
      );
      return { tagName };
    },
    async elementGetRect({ elementId }) {
      const box = await getElement(ctx, elementId).boundingBox();
      if (!box) return { x: 0, y: 0, width: 0, height: 0 };
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    },
    async elementIsDisplayed({ elementId }) {
      return { value: await getElement(ctx, elementId).isVisible() };
    },
    async elementIsEnabled({ elementId }) {
      return { value: await getElement(ctx, elementId).isEnabled() };
    },
    async elementIsSelected({ elementId }) {
      const el = getElement(ctx, elementId);
      const value = await el.evaluate((e) => {
        if (e instanceof HTMLOptionElement) return e.selected;
        if (e instanceof HTMLInputElement) return e.checked;
        return false;
      });
      return { value };
    },
    async elementGetComputedRole({ elementId }) {
      const el = getElement(ctx, elementId);
      const role = await el.evaluate(
        (e) => (e as unknown as Element).getAttribute("role") ?? "",
      );
      return { role };
    },
    async elementGetComputedLabel({ elementId }) {
      const el = getElement(ctx, elementId);
      const label = await el.evaluate(
        (e) => (e as unknown as Element).getAttribute("aria-label") ?? "",
      );
      return { label };
    },
    async elementGetShadowRoot({ elementId }) {
      const el = getElement(ctx, elementId);
      const shadowRoot = await el.evaluateHandle(
        (e) => (e as unknown as Element).shadowRoot,
      );
      if (!shadowRoot)
        throw new NoSuchElementError("Element has no shadow root");
      return {
        shadowRootId: storeShadowRoot(
          ctx,
          shadowRoot as unknown as ReturnType<typeof getShadowRoot>,
        ),
      };
    },
    async findElementFromShadowRoot({ shadowRootId, locator }) {
      const root = getShadowRoot(ctx, shadowRootId);
      const cssSelector = toCssSelector(locator.using, locator.value);
      const handle = await root.evaluateHandle(
        (sr, sel) => sr.querySelector(sel),
        cssSelector,
      );
      const el = handle.asElement();
      if (!el)
        throw new NoSuchElementError(
          `Element not found in shadow root: ${locator.using}=${locator.value}`,
        );
      return { elementId: storeElement(ctx, el) };
    },
    async findElementsFromShadowRoot({ shadowRootId, locator }) {
      const root = getShadowRoot(ctx, shadowRootId);
      const cssSelector = toCssSelector(locator.using, locator.value);
      const handles = await root.evaluateHandle(
        (sr, sel) => Array.from(sr.querySelectorAll(sel)),
        cssSelector,
      );
      const properties = await handles.getProperties();
      const elementIds: string[] = [];
      for (const prop of properties.values()) {
        const el = prop.asElement();
        if (el) elementIds.push(storeElement(ctx, el));
      }
      return { elementIds };
    },
    async elementTakeScreenshot({ elementId }) {
      const buffer = await getElement(ctx, elementId).screenshot();
      return { data: buffer.toString("base64") };
    },
  };
}
