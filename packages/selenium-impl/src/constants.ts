import { Browser } from "selenium-webdriver";

export const VALID_BROWSERS = new Set<string>([
	Browser.CHROME,
	Browser.EDGE,
	Browser.FIREFOX,
	Browser.INTERNET_EXPLORER,
]);
