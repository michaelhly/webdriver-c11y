import type {
	ElementHandlers,
	LocatorStrategy,
} from "@michaelhly.webdriver-c11y/schema";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schema";
import { By, type WebElement } from "selenium-webdriver";
import type { ClassicContext } from "./context.js";
import {
	getElement,
	getShadowRoot,
	storeElement,
	storeShadowRoot,
} from "./context.js";

function toBy(using: LocatorStrategy, value: string): By {
	switch (using) {
		case "css":
			return By.css(value);
		case "xpath":
			return By.xpath(value);
		case "id":
			return By.id(value);
		case "name":
			return By.name(value);
		case "tag-name":
			return By.css(value);
		case "class-name":
			return By.className(value);
		case "link-text":
			return By.linkText(value);
		case "partial-link-text":
			return By.partialLinkText(value);
		case "text":
			return By.xpath(`//*[contains(text(),"${value}")]`);
		case "placeholder":
			return By.css(`[placeholder="${value}"]`);
		case "role":
			return By.css(`[role="${value}"]`);
		case "label":
			return By.xpath(
				`//*[@aria-label="${value}"] | //label[contains(text(),"${value}")]//input`,
			);
		default:
			throw new UnsupportedOperationError(
				`Unsupported locator strategy: ${using as string}`,
			);
	}
}

// getAriaRole/getAccessibleName exist at runtime but are missing from @types/selenium-webdriver
interface WebElementWithAccessibility {
	getAriaRole(): Promise<string>;
	getAccessibleName(): Promise<string>;
}

export function createElementHandlers(ctx: ClassicContext): ElementHandlers {
	return {
		async findElement({ locator, fromElement }) {
			const by = toBy(locator.using, locator.value);
			const root = fromElement ? getElement(ctx, fromElement) : ctx.getDriver();
			const el = await root.findElement(by);
			return { elementId: storeElement(ctx, el) };
		},
		async findElements({ locator, fromElement }) {
			const by = toBy(locator.using, locator.value);
			const root = fromElement ? getElement(ctx, fromElement) : ctx.getDriver();
			const els = await root.findElements(by);
			return { elementIds: els.map((el) => storeElement(ctx, el)) };
		},
		async getActiveElement() {
			const el = await ctx.getDriver().switchTo().activeElement();
			return { elementId: storeElement(ctx, el) };
		},
		async elementClick({ elementId }) {
			await getElement(ctx, elementId).click();
		},
		async elementSendKeys({ elementId, text }) {
			await getElement(ctx, elementId).sendKeys(text);
		},
		async elementClear({ elementId }) {
			await getElement(ctx, elementId).clear();
		},
		async elementGetText({ elementId }) {
			return { text: await getElement(ctx, elementId).getText() };
		},
		async elementGetAttribute({ elementId, name }) {
			const val = await getElement(ctx, elementId).getAttribute(name);
			return { value: val };
		},
		async elementGetProperty({ elementId, name }) {
			const el = getElement(ctx, elementId);
			const val = await el
				.getDriver()
				.executeScript(
					(element: unknown, prop: string) =>
						(element as Record<string, unknown>)[prop],
					el,
					name,
				);
			return { value: val };
		},
		async elementGetCssValue({ elementId, propertyName }) {
			return {
				value: await getElement(ctx, elementId).getCssValue(propertyName),
			};
		},
		async elementGetTagName({ elementId }) {
			return {
				tagName: await getElement(ctx, elementId).getTagName(),
			};
		},
		async elementGetRect({ elementId }) {
			const rect = await getElement(ctx, elementId).getRect();
			return {
				x: rect.x,
				y: rect.y,
				width: rect.width,
				height: rect.height,
			};
		},
		async elementIsDisplayed({ elementId }) {
			return {
				value: await getElement(ctx, elementId).isDisplayed(),
			};
		},
		async elementIsEnabled({ elementId }) {
			return {
				value: await getElement(ctx, elementId).isEnabled(),
			};
		},
		async elementIsSelected({ elementId }) {
			return {
				value: await getElement(ctx, elementId).isSelected(),
			};
		},
		async elementGetComputedRole({ elementId }) {
			const el = getElement(ctx, elementId) as WebElement &
				WebElementWithAccessibility;
			const role = await el.getAriaRole();
			return { role };
		},
		async elementGetComputedLabel({ elementId }) {
			const el = getElement(ctx, elementId) as WebElement &
				WebElementWithAccessibility;
			const label = await el.getAccessibleName();
			return { label };
		},
		async elementGetShadowRoot({ elementId }) {
			const el = getElement(ctx, elementId);
			const shadowRoot = await el.getShadowRoot();
			return { shadowRootId: storeShadowRoot(ctx, shadowRoot) };
		},
		async findElementFromShadowRoot({ shadowRootId, locator }) {
			const root = getShadowRoot(ctx, shadowRootId);
			const by = toBy(locator.using, locator.value);
			const el = await root.findElement(by);
			return { elementId: storeElement(ctx, el) };
		},
		async findElementsFromShadowRoot({ shadowRootId, locator }) {
			const root = getShadowRoot(ctx, shadowRootId);
			const by = toBy(locator.using, locator.value);
			const els: WebElement[] = await root.findElements(by);
			return { elementIds: els.map((el) => storeElement(ctx, el)) };
		},
		async elementTakeScreenshot({ elementId }) {
			const data = await getElement(ctx, elementId).takeScreenshot();
			return { data };
		},
	};
}
