import type {
  AddPreloadScriptResult,
  BidiResponse,
  BidiScriptHandlers,
  GetRealmsResult,
} from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "../context.js";

export function createBidiScriptHandlers(
  ctx: ClassicContext,
): BidiScriptHandlers {
  return {
    async scriptEvaluate(params) {
      const bidi = await ctx.getDriver().getBidi();
      const response = await bidi.send({
        method: "script.evaluate",
        params: {
          expression: params.expression,
          target: params.target,
          awaitPromise: params.awaitPromise,
          resultOwnership: params.resultOwnership,
          serializationOptions: params.serializationOptions,
          userActivation: params.userActivation,
        },
      });
      return (response as BidiResponse<unknown>).result;
    },
    async scriptCallFunction(params) {
      const bidi = await ctx.getDriver().getBidi();
      const response = await bidi.send({
        method: "script.callFunction",
        params: {
          functionDeclaration: params.functionDeclaration,
          target: params.target,
          awaitPromise: params.awaitPromise,
          arguments: params.arguments,
          this: params.this,
          resultOwnership: params.resultOwnership,
          serializationOptions: params.serializationOptions,
          userActivation: params.userActivation,
        },
      });
      return (response as BidiResponse<unknown>).result;
    },
    async scriptAddPreloadScript(params) {
      const bidi = await ctx.getDriver().getBidi();
      const response = await bidi.send({
        method: "script.addPreloadScript",
        params: {
          functionDeclaration: params.functionDeclaration,
          arguments: params.arguments,
          contexts: params.contexts,
          sandbox: params.sandbox,
        },
      });
      return (response as BidiResponse<AddPreloadScriptResult>).result;
    },
    async scriptRemovePreloadScript(params) {
      const bidi = await ctx.getDriver().getBidi();
      await bidi.send({
        method: "script.removePreloadScript",
        params: { script: params.script },
      });
    },
    async scriptGetRealms(params) {
      const bidi = await ctx.getDriver().getBidi();
      const response = await bidi.send({
        method: "script.getRealms",
        params: {
          context: params.context,
          type: params.type,
        },
      });
      return (response as BidiResponse<GetRealmsResult>).result;
    },
    async scriptDisown(params) {
      const bidi = await ctx.getDriver().getBidi();
      await bidi.send({
        method: "script.disown",
        params: {
          target: params.target,
          handles: params.handles,
        },
      });
    },
  };
}
