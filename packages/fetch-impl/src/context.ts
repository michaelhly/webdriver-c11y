/**
 * HTTP context — holds the server URL and active session ID.
 */
export interface HttpContext {
  serverUrl: string;
  sessionId: string | null;
}

export function createContext(serverUrl: string): HttpContext {
  return { serverUrl: serverUrl.replace(/\/+$/, ""), sessionId: null };
}
