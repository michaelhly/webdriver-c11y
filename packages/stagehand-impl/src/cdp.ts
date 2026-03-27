import type { ProtocolMapping } from "devtools-protocol/types/protocol-mapping.js";
import type { Page } from "./components/context.js";

type Commands = ProtocolMapping.Commands;

export type CDPResult<M extends keyof Commands> = Commands[M]["returnType"];

export async function sendCDP<M extends keyof Commands>(
  page: Page,
  method: M,
  ...params: Commands[M]["paramsType"]
): Promise<Commands[M]["returnType"]> {
  return page.sendCDP(method, params[0] as Record<string, unknown>);
}
