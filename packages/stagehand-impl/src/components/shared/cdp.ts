import type { ProtocolMapping } from "devtools-protocol/types/protocol-mapping.js";

type Commands = ProtocolMapping.Commands;

export type CDPResult<M extends keyof Commands> = Commands[M]["returnType"];

/** Any object that can send CDP commands — covers both Page and browser-level connections. */
export interface CDPTarget {
  sendCDP<T = unknown>(method: string, params?: object): Promise<T>;
}

export async function sendCDP<M extends keyof Commands>(
  target: CDPTarget,
  method: M,
  ...params: Commands[M]["paramsType"]
): Promise<Commands[M]["returnType"]> {
  return target.sendCDP(method, params[0] as Record<string, unknown>);
}
