import {
  DriverError,
  ElementNotInteractableError,
  InvalidSelectorError,
  NoSuchAlertError,
  NoSuchElementError,
  NoSuchWindowError,
  ScriptTimeoutError,
  SessionNotCreatedError,
  StaleElementReferenceError,
  TimeoutError,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "./context.js";

// W3C WebDriver error code → typed error class
const ERROR_MAP: Record<string, new (msg: string) => DriverError> = {
  "session not created": SessionNotCreatedError,
  "no such element": NoSuchElementError,
  "stale element reference": StaleElementReferenceError,
  "element not interactable": ElementNotInteractableError,
  "no such alert": NoSuchAlertError,
  "no such window": NoSuchWindowError,
  "script timeout": ScriptTimeoutError,
  timeout: TimeoutError,
  "invalid selector": InvalidSelectorError,
  "unsupported operation": UnsupportedOperationError,
};

function toError(error: string, message: string): DriverError {
  const ErrorClass = ERROR_MAP[error] ?? DriverError;
  return new ErrorClass(message);
}

/**
 * Send an HTTP command to the WebDriver server and unwrap the `value` field.
 */
export async function command<T = unknown>(
  ctx: HttpContext,
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${ctx.serverUrl}${path}`;
  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }
  const res = await fetch(url, init);
  const json: unknown = res.status === 204 ? { value: null } : await res.json();
  const envelope = json as { value: unknown };
  if (!res.ok) {
    const err = envelope.value as
      | { error: string; message: string }
      | undefined;
    throw toError(
      err?.error ?? "unknown error",
      err?.message ?? `HTTP ${res.status}`,
    );
  }
  return envelope.value as T;
}

/** Shorthand: GET a session endpoint. */
export function get<T>(ctx: HttpContext, path: string): Promise<T> {
  return command<T>(ctx, "GET", `/session/${ctx.sessionId}${path}`);
}

/** Shorthand: POST a session endpoint. */
export function post<T>(
  ctx: HttpContext,
  path: string,
  body?: unknown,
): Promise<T> {
  return command<T>(
    ctx,
    "POST",
    `/session/${ctx.sessionId}${path}`,
    body ?? {},
  );
}

/** Shorthand: DELETE a session endpoint. */
export function del<T>(ctx: HttpContext, path: string): Promise<T> {
  return command<T>(ctx, "DELETE", `/session/${ctx.sessionId}${path}`);
}
