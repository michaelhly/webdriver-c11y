import type { ElementHandlers } from "@michaelhly.webdriver-interop/c11y";
import {
	NoSuchElementError,
	StaleElementReferenceError,
} from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./compat/context.js";
import {
	callOnElement,
	generateElementId,
	getElementLocator,
} from "./compat/element.js";
import { getActivePage } from "./compat/page.js";
import { toSelector } from "./compat/selector.js";

export function createElementHandlers(ctx: StagehandContext): ElementHandlers {
	return {
		async findElement(params) {
			const page = getActivePage(ctx);
			let selector = toSelector(params.locator.using, params.locator.value);

			if (params.fromElement) {
				selector = await findWithinParent(ctx, params.fromElement, selector);
			}

			const locator = page.locator(selector);
			const count = await locator.count();
			if (count === 0) {
				throw new NoSuchElementError(
					`No element found for ${params.locator.using}="${params.locator.value}"`,
				);
			}

			const elementId = generateElementId();
			ctx.elements.set(elementId, { selector, index: 0 });
			return { elementId };
		},

		async findElements(params) {
			const page = getActivePage(ctx);
			let selector = toSelector(params.locator.using, params.locator.value);

			if (params.fromElement) {
				selector = await findWithinParent(ctx, params.fromElement, selector);
			}

			const locator = page.locator(selector);
			const count = await locator.count();
			const elementIds: string[] = [];

			for (let i = 0; i < count; i++) {
				const id = generateElementId();
				ctx.elements.set(id, { selector, index: i });
				elementIds.push(id);
			}

			return { elementIds };
		},

		async elementClick(params) {
			const locator = getElementLocator(ctx, params.elementId);
			await wrapStale(() => locator.click());
		},

		async elementSendKeys(params) {
			const locator = getElementLocator(ctx, params.elementId);
			await wrapStale(() => locator.type(params.text));
		},

		async elementClear(params) {
			const locator = getElementLocator(ctx, params.elementId);
			await wrapStale(() => locator.fill(""));
		},

		async elementGetText(params) {
			const locator = getElementLocator(ctx, params.elementId);
			const text = await wrapStale(() => locator.textContent());
			return { text };
		},

		async elementGetAttribute(params) {
			const value = await callOnElement<string | null>(
				ctx,
				params.elementId,
				`function(){return this.getAttribute(${JSON.stringify(params.name)})}`,
			);
			return { value };
		},

		async elementGetProperty(params) {
			const value = await callOnElement<unknown>(
				ctx,
				params.elementId,
				`function(){return this[${JSON.stringify(params.name)}]}`,
			);
			return { value };
		},

		async elementGetCssValue(params) {
			const value = await callOnElement<string>(
				ctx,
				params.elementId,
				`function(){return window.getComputedStyle(this).getPropertyValue(${JSON.stringify(params.propertyName)})}`,
			);
			return { value };
		},

		async elementGetTagName(params) {
			const tagName = await callOnElement<string>(
				ctx,
				params.elementId,
				"function(){return this.tagName.toLowerCase()}",
			);
			return { tagName };
		},

		async elementGetRect(params) {
			return callOnElement(
				ctx,
				params.elementId,
				"function(){var r=this.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}}",
			);
		},

		async elementIsDisplayed(params) {
			const locator = getElementLocator(ctx, params.elementId);
			const value = await wrapStale(() => locator.isVisible());
			return { value };
		},

		async elementIsEnabled(params) {
			const value = await callOnElement<boolean>(
				ctx,
				params.elementId,
				"function(){return !this.disabled}",
			);
			return { value };
		},

		async elementIsSelected(params) {
			const value = await callOnElement<boolean>(
				ctx,
				params.elementId,
				"function(){return this.checked===true||this.selected===true}",
			);
			return { value };
		},

		async elementTakeScreenshot(params) {
			const rect = await callOnElement<{
				x: number;
				y: number;
				width: number;
				height: number;
			}>(
				ctx,
				params.elementId,
				"function(){var r=this.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}}",
			);
			const page = getActivePage(ctx);
			const buffer = await page.screenshot({ clip: rect });
			return { data: buffer.toString("base64") };
		},
	};
}

// ---------------------------------------------------------------------------
// fromElement support — search within a parent element via CDP
// ---------------------------------------------------------------------------

async function findWithinParent(
	ctx: StagehandContext,
	parentId: string,
	childSelector: string,
): Promise<string> {
	const page = getActivePage(ctx);
	const parentLocator = getElementLocator(ctx, parentId);
	const { objectId } = await parentLocator.resolveNode();

	const isXpath = childSelector.startsWith("xpath/");
	const searchExpr = isXpath ? childSelector.slice(6) : childSelector;
	const tagId = generateElementId();

	const response = await page.sendCDP<{
		result: { value: boolean };
	}>("Runtime.callFunctionOn", {
		objectId,
		functionDeclaration: isXpath
			? `function(xpath,tagId){var iter=document.evaluate(xpath,this,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);var el=iter.singleNodeValue;if(!el||!(el instanceof Element))return false;el.setAttribute("data-wdc-eid",tagId);return true}`
			: `function(sel,tagId){var el=this.querySelector(sel);if(!el)return false;el.setAttribute("data-wdc-eid",tagId);return true}`,
		arguments: [{ value: searchExpr }, { value: tagId }],
		returnByValue: true,
	});

	if (!response.result.value) {
		throw new NoSuchElementError("Element not found within parent");
	}

	return `[data-wdc-eid="${tagId}"]`;
}

// ---------------------------------------------------------------------------
// Stale element wrapper — maps Stagehand resolution errors to the c11y error
// ---------------------------------------------------------------------------

async function wrapStale<T>(fn: () => Promise<T>): Promise<T> {
	try {
		return await fn();
	} catch (err) {
		if (
			err instanceof Error &&
			/stale|detached|disposed/i.test(err.message)
		) {
			throw new StaleElementReferenceError(err.message);
		}
		throw err;
	}
}
