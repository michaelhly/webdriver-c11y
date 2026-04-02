import { describe, expect, test } from "vitest";
import { createHttpClassicDriver } from "../../../src/index.js";

describe("Chrome session", () => {
  test("#newSession", async () => {
    const driver = createHttpClassicDriver({
      serverUrl: process.env["SELENIUM_REMOTE_URL"] ?? "http://localhost:4444",
    });
    const session = await driver.newSession({
      capabilities: { alwaysMatch: { browserName: "chrome" } },
    });
    expect(session.capabilities.browserName).toBe("chrome");

    await driver.navigateTo({ url: "https://www.w3.org/TR/webdriver2/" });

    const { title } = await driver.getTitle();
    expect(title).toBe("WebDriver");

    await driver.deleteSession();
  });
});
