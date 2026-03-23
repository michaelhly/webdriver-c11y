declare module "vibium" {
	// ---- Element ----

	export interface BoundingBox {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	export interface ElementInfo {
		tag: string;
		text: string;
		box: BoundingBox;
	}

	export interface ActionOptions {
		timeout?: number;
	}

	export interface SelectorOptions {
		role?: string;
		text?: string;
		label?: string;
		placeholder?: string;
		alt?: string;
		title?: string;
		testid?: string;
		xpath?: string;
		near?: string;
		timeout?: number;
	}

	export type FluentElement = Promise<Element> & {
		click(options?: ActionOptions): Promise<void>;
		dblclick(options?: ActionOptions): Promise<void>;
		fill(value: string, options?: ActionOptions): Promise<void>;
		type(text: string, options?: ActionOptions): Promise<void>;
		press(key: string, options?: ActionOptions): Promise<void>;
		clear(options?: ActionOptions): Promise<void>;
		check(options?: ActionOptions): Promise<void>;
		uncheck(options?: ActionOptions): Promise<void>;
		selectOption(
			value: string,
			options?: ActionOptions,
		): Promise<void>;
		hover(options?: ActionOptions): Promise<void>;
		focus(options?: ActionOptions): Promise<void>;
		tap(options?: ActionOptions): Promise<void>;
		scrollIntoView(options?: ActionOptions): Promise<void>;
		text(): Promise<string>;
		innerText(): Promise<string>;
		html(): Promise<string>;
		value(): Promise<string>;
		attr(name: string): Promise<string | null>;
		getAttribute(name: string): Promise<string | null>;
		bounds(): Promise<BoundingBox>;
		boundingBox(): Promise<BoundingBox>;
		isVisible(): Promise<boolean>;
		isHidden(): Promise<boolean>;
		isEnabled(): Promise<boolean>;
		isChecked(): Promise<boolean>;
		isEditable(): Promise<boolean>;
		role(): Promise<string>;
		label(): Promise<string>;
		screenshot(): Promise<Buffer>;
		find(
			selector: string | SelectorOptions,
			options?: { timeout?: number },
		): FluentElement;
		findAll(
			selector: string | SelectorOptions,
			options?: { timeout?: number },
		): Promise<Element[]>;
	};

	export class Element {
		readonly info: ElementInfo;
		toParams(): Record<string, unknown>;
		click(options?: ActionOptions): Promise<void>;
		dblclick(options?: ActionOptions): Promise<void>;
		fill(value: string, options?: ActionOptions): Promise<void>;
		type(text: string, options?: ActionOptions): Promise<void>;
		press(key: string, options?: ActionOptions): Promise<void>;
		clear(options?: ActionOptions): Promise<void>;
		check(options?: ActionOptions): Promise<void>;
		uncheck(options?: ActionOptions): Promise<void>;
		selectOption(
			value: string,
			options?: ActionOptions,
		): Promise<void>;
		hover(options?: ActionOptions): Promise<void>;
		focus(options?: ActionOptions): Promise<void>;
		dragTo(target: Element, options?: ActionOptions): Promise<void>;
		tap(options?: ActionOptions): Promise<void>;
		scrollIntoView(options?: ActionOptions): Promise<void>;
		dispatchEvent(
			eventType: string,
			eventInit?: Record<string, unknown>,
			options?: ActionOptions,
		): Promise<void>;
		setFiles(
			files: string[],
			options?: ActionOptions,
		): Promise<void>;
		text(): Promise<string>;
		innerText(): Promise<string>;
		html(): Promise<string>;
		value(): Promise<string>;
		attr(name: string): Promise<string | null>;
		getAttribute(name: string): Promise<string | null>;
		bounds(): Promise<BoundingBox>;
		boundingBox(): Promise<BoundingBox>;
		isVisible(): Promise<boolean>;
		isHidden(): Promise<boolean>;
		isEnabled(): Promise<boolean>;
		isChecked(): Promise<boolean>;
		isEditable(): Promise<boolean>;
		role(): Promise<string>;
		label(): Promise<string>;
		screenshot(): Promise<Buffer>;
		waitUntil(
			state?: string,
			options?: { timeout?: number },
		): Promise<void>;
		find(
			selector: string | SelectorOptions,
			options?: { timeout?: number },
		): FluentElement;
		findAll(
			selector: string | SelectorOptions,
			options?: { timeout?: number },
		): Promise<Element[]>;
	}

	// ---- Dialog ----

	export class Dialog {
		message(): string;
		type(): string;
		defaultValue(): string;
		accept(promptText?: string): Promise<void>;
		dismiss(): Promise<void>;
	}

	// ---- Cookie / Context ----

	export interface Cookie {
		name: string;
		value: string;
		domain: string;
		path: string;
		size: number;
		httpOnly: boolean;
		secure: boolean;
		sameSite: string;
		expiry?: number;
	}

	export interface SetCookieParam {
		name: string;
		value: string;
		domain?: string;
		url?: string;
		path?: string;
		httpOnly?: boolean;
		secure?: boolean;
		sameSite?: string;
		expiry?: number;
	}

	export class BrowserContext {
		readonly id: string;
		newPage(): Promise<Page>;
		close(): Promise<void>;
		cookies(urls?: string[]): Promise<Cookie[]>;
		setCookies(cookies: SetCookieParam[]): Promise<void>;
		clearCookies(): Promise<void>;
	}

	// ---- Page ----

	export interface ScreenshotOptions {
		fullPage?: boolean;
		clip?: { x: number; y: number; width: number; height: number };
	}

	export interface FindOptions {
		timeout?: number;
	}

	export class Page {
		readonly id: string;
		readonly context: BrowserContext;

		// Navigation
		go(url: string): Promise<void>;
		back(): Promise<void>;
		forward(): Promise<void>;
		reload(): Promise<void>;
		url(): Promise<string>;
		title(): Promise<string>;
		content(): Promise<string>;

		// Finding
		find(
			selector: string | SelectorOptions,
			options?: FindOptions,
		): FluentElement;
		findAll(
			selector: string | SelectorOptions,
			options?: FindOptions,
		): Promise<Element[]>;

		// Screenshots & evaluation
		screenshot(options?: ScreenshotOptions): Promise<Buffer>;
		evaluate<T = unknown>(expression: string): Promise<T>;

		// Window
		setWindow(options: {
			width?: number;
			height?: number;
			x?: number;
			y?: number;
			state?:
				| "normal"
				| "maximized"
				| "minimized"
				| "fullscreen";
		}): Promise<void>;
		window(): Promise<{
			state: string;
			width: number;
			height: number;
			x: number;
			y: number;
		}>;

		// Dialogs
		onDialog(handler: (dialog: Dialog) => void): void;

		// Content
		setContent(html: string): Promise<void>;
		bringToFront(): Promise<void>;
		close(): Promise<void>;
	}

	// ---- Browser ----

	export interface StartOptions {
		headless?: boolean;
		headers?: Record<string, string>;
		executablePath?: string;
	}

	export class Browser {
		page(): Promise<Page>;
		newPage(): Promise<Page>;
		newContext(): Promise<BrowserContext>;
		pages(): Promise<Page[]>;
		onPage(callback: (page: Page) => void): void;
		onPopup(callback: (page: Page) => void): void;
		stop(): Promise<void>;
	}

	export const browser: {
		start(
			urlOrOptions?: string | StartOptions,
			options?: StartOptions,
		): Promise<Browser>;
	};

	// ---- Errors ----

	export class ConnectionError extends Error {}
	export class TimeoutError extends Error {}
	export class ElementNotFoundError extends Error {}
	export class BrowserCrashedError extends Error {}
}
