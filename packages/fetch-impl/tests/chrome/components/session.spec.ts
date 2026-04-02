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

    await driver.navigateTo({ url: "https://selenium.dev" });

    const { title } = await driver.getTitle();
    expect(title).toBe("Selenium");

    await driver.deleteSession();
  });
});
