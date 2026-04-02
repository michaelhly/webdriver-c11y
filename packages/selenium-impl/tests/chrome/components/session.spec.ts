import { Capabilities } from "selenium-webdriver";
import { describe, expect, test } from "vitest";
import {
  ChromeOptions,
  createSeleniumDriver,
  normalizeSeleniumCapabilities,
} from "../../../src/index.js";

describe("Chrome session", () => {
  test("#newSession", async () => {
    const driver = createSeleniumDriver();
    const session = await driver.newSession({
      capabilities: { alwaysMatch: { browserName: "chrome" } },
    });
    expect(session.capabilities.browserName).toBe("chrome");

    await driver.navigateTo({ url: "https://selenium.dev" });

    const { title } = await driver.getTitle();
    expect(title).toBe("Selenium");

    await driver.deleteSession();
  });

  test("#newSession with Selenium Grid capabilities", async () => {
    const caps = Capabilities.chrome();
    caps.set("se:downloadsEnabled", false);
    caps.set("se:deleteSessionOnUi", false);

    const alwaysMatch = normalizeSeleniumCapabilities(caps);
    const driver = createSeleniumDriver();
    const session = await driver.newSession({ capabilities: { alwaysMatch } });
    expect(session.capabilities["se:downloadsEnabled"]).toBe(false);
    expect(session.capabilities["se:deleteSessionOnUi"]).toBe(false);
    await driver.deleteSession();
  });

  describe("#newSession with Selenium Options", () => {
    test("headless", async () => {
      const options = new ChromeOptions();
      options.addArguments("--headless");
      const driver = createSeleniumDriver({ chrome: options });
      await driver.newSession({
        capabilities: { alwaysMatch: { browserName: "chrome" } },
      });

      const { value: userAgent } = await driver.executeScript({
        script: () => navigator.userAgent,
      });
      expect(userAgent).toContain("HeadlessChrome");
      await driver.deleteSession();
    });

    test("start maximized", async () => {
      const options = new ChromeOptions();
      options.addArguments("--start-maximized");
      const driver = createSeleniumDriver({ chrome: options });
      await driver.newSession({
        capabilities: { alwaysMatch: { browserName: "chrome" } },
      });

      const { value: dim } = await driver.executeScript<{
        width: number;
        height: number;
      }>({
        script: () => ({
          width: window.outerWidth,
          height: window.outerHeight,
        }),
      });
      expect(dim).toEqual({ width: 1920, height: 1058 });
      await driver.deleteSession();
    });
  });
});
