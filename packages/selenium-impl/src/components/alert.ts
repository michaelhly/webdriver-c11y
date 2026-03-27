import type { AlertHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "./context.js";

export function createAlertHandlers(ctx: ClassicContext): AlertHandlers {
  return {
    async getAlertText() {
      const alert = await ctx.getDriver().switchTo().alert();
      return { text: await alert.getText() };
    },
    async acceptAlert() {
      const alert = await ctx.getDriver().switchTo().alert();
      await alert.accept();
    },
    async dismissAlert() {
      const alert = await ctx.getDriver().switchTo().alert();
      await alert.dismiss();
    },
    async sendAlertText({ text }) {
      const alert = await ctx.getDriver().switchTo().alert();
      await alert.sendKeys(text);
    },
  };
}
