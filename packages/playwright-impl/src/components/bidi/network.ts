import type { BidiNetworkHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "../context.js";

export function createBidiNetworkHandlers(
  _ctx: PlaywrightContext,
): BidiNetworkHandlers {
  return {
    async networkAddIntercept(_params) {
      throw new UnsupportedOperationError(
        "BiDi network.addIntercept is not supported in Playwright — use Playwright's page.route() API instead",
      );
    },
    async networkRemoveIntercept(_params) {
      throw new UnsupportedOperationError(
        "BiDi network.removeIntercept is not supported in Playwright",
      );
    },
    async networkContinueRequest(_params) {
      throw new UnsupportedOperationError(
        "BiDi network.continueRequest is not supported in Playwright",
      );
    },
    async networkContinueResponse(_params) {
      throw new UnsupportedOperationError(
        "BiDi network.continueResponse is not supported in Playwright",
      );
    },
    async networkProvideResponse(_params) {
      throw new UnsupportedOperationError(
        "BiDi network.provideResponse is not supported in Playwright",
      );
    },
    async networkFailRequest(_params) {
      throw new UnsupportedOperationError(
        "BiDi network.failRequest is not supported in Playwright",
      );
    },
    async networkContinueWithAuth(_params) {
      throw new UnsupportedOperationError(
        "BiDi network.continueWithAuth is not supported in Playwright",
      );
    },
    async networkSetCacheBehavior(_params) {
      throw new UnsupportedOperationError(
        "BiDi network.setCacheBehavior is not supported in Playwright",
      );
    },
  };
}
