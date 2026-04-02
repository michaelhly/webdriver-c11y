import { Capabilities } from "selenium-webdriver";
import { describe, expect, test } from "vitest";

import { normalizeSeleniumCapabilities } from "../../src/capabilities.js";

describe("normalizeSeleniumCapabilities", () => {
  test("maps Capabilities.chrome()", () => {
    const caps = normalizeSeleniumCapabilities(Capabilities.chrome());
    expect(caps.browserName).toBe("chrome");
  });

  test("preserves vendor keys from Selenium Capabilities", () => {
    const caps = normalizeSeleniumCapabilities(
      Capabilities.chrome().set("goog:chromeOptions", { args: ["--headless"] }),
    );
    expect(caps["goog:chromeOptions"]).toEqual({ args: ["--headless"] });
  });

  test("preserves proxy configuration", () => {
    const caps = Capabilities.chrome();

    const proxyConfig = {
      proxyType: "manual",
      httpProxy: "127.0.0.1:8888",
    };
    caps.setProxy(proxyConfig);
    const normalized = normalizeSeleniumCapabilities(caps);
    expect(normalized.proxy).toStrictEqual(proxyConfig);
  });
});
