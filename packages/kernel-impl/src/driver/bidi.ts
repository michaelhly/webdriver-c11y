import {
  type BidiDriver,
  createBidiDriver,
} from "@michaelhly.webdriver-c11y/schemas";
import {
  createBidiBrowserHandlers,
  createBidiBrowsingContextHandlers,
  createBidiInputHandlers,
  createBidiLogHandlers,
  createBidiNetworkHandlers,
  createBidiScriptHandlers,
  createBidiStorageHandlers,
} from "../components/bidi/index.js";

export function buildBidiComponents() {
  return {
    browsingContext: createBidiBrowsingContextHandlers(),
    network: createBidiNetworkHandlers(),
    script: createBidiScriptHandlers(),
    log: createBidiLogHandlers(),
    input: createBidiInputHandlers(),
    storage: createBidiStorageHandlers(),
    browser: createBidiBrowserHandlers(),
  };
}

export function createKernelBidiDriver(): BidiDriver {
  return createBidiDriver({
    protocol: "cdp",
    ...buildBidiComponents(),
  });
}
