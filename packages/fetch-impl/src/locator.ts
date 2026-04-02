import {
  type LocatorStrategy,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-c11y/schemas";

/**
 * Map schema LocatorStrategy to the W3C WebDriver wire-protocol `using` + `value`.
 * Non-standard strategies (id, name, class-name, text, role, label, placeholder)
 * are converted to css selector or xpath equivalents.
 */
export function toWireLocator(
  using: LocatorStrategy,
  value: string,
): { using: string; value: string } {
  switch (using) {
    case "css":
      return { using: "css selector", value };
    case "xpath":
      return { using: "xpath", value };
    case "id":
      return { using: "css selector", value: `[id="${value}"]` };
    case "name":
      return { using: "css selector", value: `[name="${value}"]` };
    case "tag-name":
      return { using: "tag name", value };
    case "class-name":
      return { using: "css selector", value: `.${value}` };
    case "link-text":
      return { using: "link text", value };
    case "partial-link-text":
      return { using: "partial link text", value };
    case "text":
      return { using: "xpath", value: `//*[contains(text(),"${value}")]` };
    case "placeholder":
      return { using: "css selector", value: `[placeholder="${value}"]` };
    case "role":
      return { using: "css selector", value: `[role="${value}"]` };
    case "label":
      return {
        using: "xpath",
        value: `//*[@aria-label="${value}"] | //label[contains(text(),"${value}")]//input`,
      };
    default:
      throw new UnsupportedOperationError(
        `Unsupported locator strategy: ${using as string}`,
      );
  }
}
