declare module "vibium" {
	export interface StartOptions {
		headless?: boolean;
		executablePath?: string;
		args?: string[];
	}

	export interface ScreenshotOptions {
		fullPage?: boolean;
	}

	export interface CookieData {
		name: string;
		value: string;
		domain?: string;
		path?: string;
		secure?: boolean;
		httpOnly?: boolean;
		expires?: number;
		sameSite?: "Strict" | "Lax" | "None";
	}

	export interface StorageState {
		cookies: CookieData[];
	}

	export interface ElementBounds {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	export class Element {
		click(): Promise<void>;
		dblclick(): Promise<void>;
		fill(text: string): Promise<void>;
		type(text: string): Promise<void>;
		press(key: string): Promise<void>;
		clear(): Promise<void>;
		selectOption(value: string): Promise<void>;
		hover(): Promise<void>;
		focus(): Promise<void>;
		text(): Promise<string>;
		innerText(): Promise<string>;
		html(): Promise<string>;
		value(): Promise<string>;
		attr(name: string): Promise<string | null>;
		bounds(): Promise<ElementBounds>;
		boundingBox(): Promise<ElementBounds>;
		isVisible(): Promise<boolean>;
		isHidden(): Promise<boolean>;
		isEnabled(): Promise<boolean>;
		isChecked(): Promise<boolean>;
		isEditable(): Promise<boolean>;
		role(): Promise<string>;
		label(): Promise<string>;
		screenshot(): Promise<Buffer>;
	}

	export interface Dialog {
		accept(text?: string): Promise<void>;
		dismiss(): Promise<void>;
		message(): string;
	}

	export class Page {
		go(url: string): Promise<void>;
		back(): Promise<void>;
		forward(): Promise<void>;
		reload(): Promise<void>;
		url(): Promise<string>;
		title(): Promise<string>;
		content(): Promise<string>;
		find(selector: string, options?: Record<string, unknown>): Promise<Element>;
		findAll(selector: string, options?: Record<string, unknown>): Promise<Element[]>;
		evaluate<T = unknown>(expression: string, ...args: unknown[]): Promise<T>;
		screenshot(options?: ScreenshotOptions): Promise<Buffer>;
		onDialog(callback: (dialog: Dialog) => void): void;
	}

	export class BrowserContext {
		newPage(): Promise<Page>;
		close(): Promise<void>;
		cookies(urls?: string[]): Promise<CookieData[]>;
		setCookies(cookies: CookieData[]): Promise<void>;
		clearCookies(): Promise<void>;
		storage(): Promise<StorageState>;
		setStorage(state: StorageState): Promise<void>;
		clearStorage(): Promise<void>;
	}

	export class Browser {
		page(): Promise<Page>;
		newPage(): Promise<Page>;
		pages(): Promise<Page[]>;
		newContext(): Promise<BrowserContext>;
		stop(): Promise<void>;
	}

	export const browser: {
		start(options?: StartOptions): Promise<Browser>;
	};
}
