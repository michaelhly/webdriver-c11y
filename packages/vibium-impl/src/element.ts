import type {
	ElementHandlers,
	LocatorStrategy,
} from "@michaelhly.webdriver-interop/c11y";
import { UnsupportedOperationError } from "@michaelhly.webdriver-interop/c11y";
import type { VibiumContext } from "./context.js";
import { storeElement, getElement } from "./context.js";

function toCssSelector(using: LocatorStrategy, value: string): string {
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
		case "xpath":
		case "link-text":
		case "partial-link-text":
		case "text":
		case "label":
			throw new UnsupportedOperationError(
				`Locator strategy "${using}" is not supported by the BiDi backend`,
			);
		default:
			throw new UnsupportedOperationError(
				`Unknown locator strategy: ${using as string}`,
			);
	}
}

export function createElementHandlers(ctx: VibiumContext): ElementHandlers {
	return {
		async findElement({ locator }) {
			const selector = toCssSelector(locator.using, locator.value);
			const el = await ctx.getPage().find(selector);
			return { elementId: storeElement(ctx, el) };
		},
		async findElements({ locator }) {
			const selector = toCssSelector(locator.using, locator.value);
			const els = await ctx.getPage().findAll(selector);
			return { elementIds: els.map((el) => storeElement(ctx, el)) };
		},
		async elementClick({ elementId }) {
			await getElement(ctx, elementId).click();
		},
		async elementSendKeys({ elementId, text }) {
			await getElement(ctx, elementId).type(text);
		},
		async elementClear({ elementId }) {
			await getElement(ctx, elementId).clear();
		},
		async elementGetText({ elementId }) {
			return { text: await getElement(ctx, elementId).text() };
		},
		async elementGetAttribute({ elementId, name }) {
			const value = await getElement(ctx, elementId).attr(name);
			return { value };
		},
		async elementGetProperty({ elementId, name }) {
			const el = getElement(ctx, elementId);
			const value = await ctx
				.getPage()
				.evaluate(
					`(el, prop) => el[prop]`,
					el,
					name,
				);
			return { value };
		},
		async elementGetCssValue({ elementId, propertyName }) {
			const el = getElement(ctx, elementId);
			const value = await ctx
				.getPage()
				.evaluate(
					`(el, prop) => getComputedStyle(el).getPropertyValue(prop)`,
					el,
					propertyName,
				);
			return { value: String(value) };
		},
		async elementGetTagName({ elementId }) {
			const el = getElement(ctx, elementId);
			const tagName = await ctx
				.getPage()
				.evaluate(`(el) => el.tagName.toLowerCase()`, el);
			return { tagName: String(tagName) };
		},
		async elementGetRect({ elementId }) {
			const b = await getElement(ctx, elementId).bounds();
			return { x: b.x, y: b.y, width: b.width, height: b.height };
		},
		async elementIsDisplayed({ elementId }) {
			return { value: await getElement(ctx, elementId).isVisible() };
		},
		async elementIsEnabled({ elementId }) {
			return { value: await getElement(ctx, elementId).isEnabled() };
		},
		async elementIsSelected({ elementId }) {
			return { value: await getElement(ctx, elementId).isChecked() };
		},
		async elementTakeScreenshot({ elementId }) {
			const buf = await getElement(ctx, elementId).screenshot();
			return { data: buf.toString("base64") };
		},
	};
}
