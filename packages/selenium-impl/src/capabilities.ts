import type { Capabilities } from "@michaelhly.webdriver-c11y/schemas";
import type { Capabilities as SeleniumCapabilities } from "selenium-webdriver";

export const normalizeSeleniumCapabilities = (
  caps: SeleniumCapabilities,
): Capabilities => {
  const normalized: Capabilities = {};
  for (const key of caps.keys()) {
    normalized[key] = caps.get(key);
  }
  return normalized;
};
