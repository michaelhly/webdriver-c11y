import { ElementNotFoundError, type SelectorOptions } from "vibium";
import type {
	ElementHandlers,
	LocatorStrategy,
} from "@michaelhly.webdriver-interop/c11y";
import {
	NoSuchElementError,
	UnsupportedOperationError,
} from "@michaelhly.webdriver-interop/c11y";
import type { BidiContext } from "./context.js";
import { storeElement, getElement } from "./context.js";

function toSelector(
	using: LocatorStrategy,
	value: string,
): string | SelectorOptions {
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
			return { placeholder: value };
		case "role":
			return { role: value };
		case "text":
			return { text: value };
		case "label":
			return { label: value };
		case "xpath":
			return { xpath: value };
		case "link-text":
		case "partial-link-text":
			throw new UnsupportedOperationError(
				`Unsupported locator strategy: ${using}`,
			);
		default:
			throw new UnsupportedOperationError(
				`Unsupported locator strategy: ${using as string}`,
			);
	}
}

export function createElementHandlers(ctx: BidiContext): ElementHandlers {
	return {
		async findElement({ locator, fromElement }) {
			const selector = toSelector(locator.using, locator.value);
			const root = fromElement
				? getElement(ctx, fromElement)
				: ctx.getPage();
			try {
				const el = await root.find(selector);
				return { elementId: storeElement(ctx, el) };
			} catch (e) {
				if (e instanceof ElementNotFoundError) {
					throw new NoSuchElementError(
						`Element not found: ${locator.using}=${locator.value}`,
					);
				}
				throw e;
			}
		},
		async findElements({ locator, fromElement }) {
			const selector = toSelector(locator.using, locator.value);
			const root = fromElement
				? getElement(ctx, fromElement)
				: ctx.getPage();
			const els = await root.findAll(selector);
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
			return { value: await getElement(ctx, elementId).attr(name) };
		},
		async elementGetProperty({ elementId, name }) {
			const el = getElement(ctx, elementId);
			switch (name) {
				case "value":
					return { value: await el.value() };
				case "checked":
					return { value: await el.isChecked() };
				case "innerText":
					return { value: await el.innerText() };
				case "textContent":
					return { value: await el.text() };
				default:
					return { value: await el.attr(name) };
			}
		},
		async elementGetCssValue({ elementId, propertyName }) {
			const el = getElement(ctx, elementId);
			const bounds = await el.bounds();
			const cx = bounds.x + bounds.width / 2;
			const cy = bounds.y + bounds.height / 2;
			const value = await ctx.getPage().evaluate<string>(
				`(() => {
					const el = document.elementFromPoint(${String(cx)}, ${String(cy)});
					return el ? getComputedStyle(el).getPropertyValue(${JSON.stringify(propertyName)}) : '';
				})()`,
			);
			return { value: String(value ?? "") };
		},
		async elementGetTagName({ elementId }) {
			return { tagName: getElement(ctx, elementId).info.tag };
		},
		async elementGetRect({ elementId }) {
			const bounds = await getElement(ctx, elementId).bounds();
			return {
				x: bounds.x,
				y: bounds.y,
				width: bounds.width,
				height: bounds.height,
			};
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
