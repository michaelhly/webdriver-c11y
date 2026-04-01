import { expect, test } from "vitest";
import { createSeleniumDriver } from "../src/index.js";

test("Basic", async () => {
    const driver = createSeleniumDriver();
    const session = await driver.newSession({
        capabilities: { alwaysMatch: { browserName: "chrome" } },
    });
    expect(session.capabilities.browserName).toBe("chrome");

    await driver.navigateTo({ url: "https://selenium.dev" });

    const { title } = await driver.getTitle();
    expect(title).toBe("Selenium");

    await driver.deleteSession()
});