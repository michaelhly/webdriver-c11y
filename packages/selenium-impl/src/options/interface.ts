import type { Capabilities } from "@michaelhly.webdriver-c11y/schemas";

export interface SeleniumBrowserOptions<TOptions> {
    readonly capKey: string;

    fromCapabilities(caps: Capabilities): TOptions; 
}