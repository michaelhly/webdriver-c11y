import { describe, expect, test } from "vitest";

import { ChromeOptions, createSeleniumDriver } from "../../src/index.js";

test("Basic Capabilities", async () => {
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

describe("Capabilities with selenium options", async () => {
  test("headless", async () => {
    const options = new ChromeOptions();
    options.addArguments("--headless");
    const driver = createSeleniumDriver({ chrome: options });
    await driver.newSession({
      capabilities: { alwaysMatch: { browserName: "chrome" } },
    });

    const { value: userAgent } = await driver.executeScript({
      script: () => navigator.userAgent
    });
    expect(userAgent).toContain("HeadlessChrome");
  });
});

