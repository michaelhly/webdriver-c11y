import type { ElementHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { W3C_ELEMENT_KEY, W3C_SHADOW_KEY } from "../constants.js";
import type { HttpContext } from "../context.js";
import { get, post } from "../http.js";
import { toWireLocator } from "../locator.js";

type ElementRef = { [W3C_ELEMENT_KEY]: string };
type ShadowRef = { [W3C_SHADOW_KEY]: string };

function extractElementId(ref: unknown): string {
  return (ref as ElementRef)[W3C_ELEMENT_KEY] as string;
}

function extractShadowId(ref: unknown): string {
  return (ref as ShadowRef)[W3C_SHADOW_KEY] as string;
}

export function createElementHandlers(ctx: HttpContext): ElementHandlers {
  return {
    async findElement({ locator, fromElement }) {
      const body = toWireLocator(locator.using, locator.value);
      const path = fromElement ? `/element/${fromElement}/element` : "/element";
      const ref = await post<ElementRef>(ctx, path, body);
      return { elementId: extractElementId(ref) };
    },
    async findElements({ locator, fromElement }) {
      const body = toWireLocator(locator.using, locator.value);
      const path = fromElement
        ? `/element/${fromElement}/elements`
        : "/elements";
      const refs = await post<ElementRef[]>(ctx, path, body);
      return { elementIds: refs.map(extractElementId) };
    },
    async getActiveElement() {
      const ref = await get<ElementRef>(ctx, "/element/active");
      return { elementId: extractElementId(ref) };
    },
    async elementClick({ elementId }) {
      await post(ctx, `/element/${elementId}/click`);
    },
    async elementSendKeys({ elementId, text }) {
      await post(ctx, `/element/${elementId}/value`, { text });
    },
    async elementClear({ elementId }) {
      await post(ctx, `/element/${elementId}/clear`);
    },
    async elementGetText({ elementId }) {
      const text = await get<string>(ctx, `/element/${elementId}/text`);
      return { text };
    },
    async elementGetAttribute({ elementId, name }) {
      const value = await get<string | null>(
        ctx,
        `/element/${elementId}/attribute/${name}`,
      );
      return { value };
    },
    async elementGetProperty({ elementId, name }) {
      const value = await get<unknown>(
        ctx,
        `/element/${elementId}/property/${name}`,
      );
      return { value };
    },
    async elementGetCssValue({ elementId, propertyName }) {
      const value = await get<string>(
        ctx,
        `/element/${elementId}/css/${propertyName}`,
      );
      return { value };
    },
    async elementGetTagName({ elementId }) {
      const tagName = await get<string>(ctx, `/element/${elementId}/name`);
      return { tagName };
    },
    async elementGetRect({ elementId }) {
      return get(ctx, `/element/${elementId}/rect`);
    },
    async elementIsDisplayed({ elementId }) {
      const value = await get<boolean>(ctx, `/element/${elementId}/displayed`);
      return { value };
    },
    async elementIsEnabled({ elementId }) {
      const value = await get<boolean>(ctx, `/element/${elementId}/enabled`);
      return { value };
    },
    async elementIsSelected({ elementId }) {
      const value = await get<boolean>(ctx, `/element/${elementId}/selected`);
      return { value };
    },
    async elementGetComputedRole({ elementId }) {
      const role = await get<string>(ctx, `/element/${elementId}/computedrole`);
      return { role };
    },
    async elementGetComputedLabel({ elementId }) {
      const label = await get<string>(
        ctx,
        `/element/${elementId}/computedlabel`,
      );
      return { label };
    },
    async elementGetShadowRoot({ elementId }) {
      const ref = await get<ShadowRef>(ctx, `/element/${elementId}/shadow`);
      return { shadowRootId: extractShadowId(ref) };
    },
    async findElementFromShadowRoot({ shadowRootId, locator }) {
      const body = toWireLocator(locator.using, locator.value);
      const ref = await post<ElementRef>(
        ctx,
        `/shadow/${shadowRootId}/element`,
        body,
      );
      return { elementId: extractElementId(ref) };
    },
    async findElementsFromShadowRoot({ shadowRootId, locator }) {
      const body = toWireLocator(locator.using, locator.value);
      const refs = await post<ElementRef[]>(
        ctx,
        `/shadow/${shadowRootId}/elements`,
        body,
      );
      return { elementIds: refs.map(extractElementId) };
    },
    async elementTakeScreenshot({ elementId }) {
      const data = await get<string>(ctx, `/element/${elementId}/screenshot`);
      return { data };
    },
  };
}
