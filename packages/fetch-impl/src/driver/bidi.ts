import {
  type BidiDriverComponents,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-c11y/schemas";

const unsupported = (name: string) => () => {
  throw new UnsupportedOperationError(
    `BiDi is not supported over HTTP: ${name}`,
  );
};

export function buildBidiComponents(): Omit<BidiDriverComponents, "protocol"> {
  return {
    browsingContext: {
      browsingContextCreate: unsupported("browsingContext.create"),
      browsingContextClose: unsupported("browsingContext.close"),
      browsingContextActivate: unsupported("browsingContext.activate"),
      browsingContextNavigate: unsupported("browsingContext.navigate"),
      browsingContextReload: unsupported("browsingContext.reload"),
      browsingContextTraverseHistory: unsupported(
        "browsingContext.traverseHistory",
      ),
      browsingContextGetTree: unsupported("browsingContext.getTree"),
      browsingContextSetViewport: unsupported("browsingContext.setViewport"),
      browsingContextPrint: unsupported("browsingContext.print"),
    },
    network: {
      networkAddIntercept: unsupported("network.addIntercept"),
      networkRemoveIntercept: unsupported("network.removeIntercept"),
      networkContinueRequest: unsupported("network.continueRequest"),
      networkContinueResponse: unsupported("network.continueResponse"),
      networkProvideResponse: unsupported("network.provideResponse"),
      networkFailRequest: unsupported("network.failRequest"),
      networkContinueWithAuth: unsupported("network.continueWithAuth"),
      networkSetCacheBehavior: unsupported("network.setCacheBehavior"),
    },
    script: {
      scriptEvaluate: unsupported("script.evaluate"),
      scriptCallFunction: unsupported("script.callFunction"),
      scriptAddPreloadScript: unsupported("script.addPreloadScript"),
      scriptRemovePreloadScript: unsupported("script.removePreloadScript"),
      scriptGetRealms: unsupported("script.getRealms"),
      scriptDisown: unsupported("script.disown"),
    },
    log: {
      onLogEntry: unsupported("log.onLogEntry"),
    },
    input: {
      inputPerformActions: unsupported("input.performActions"),
      inputReleaseActions: unsupported("input.releaseActions"),
      inputSetFiles: unsupported("input.setFiles"),
    },
    storage: {
      storageGetCookies: unsupported("storage.getCookies"),
      storageSetCookie: unsupported("storage.setCookie"),
      storageDeleteCookies: unsupported("storage.deleteCookies"),
    },
    browser: {
      browserClose: unsupported("browser.close"),
      browserCreateUserContext: unsupported("browser.createUserContext"),
      browserGetUserContexts: unsupported("browser.getUserContexts"),
      browserRemoveUserContext: unsupported("browser.removeUserContext"),
      browserGetClientWindows: unsupported("browser.getClientWindows"),
      browserSetClientWindowState: unsupported("browser.setClientWindowState"),
    },
  } as never;
}
