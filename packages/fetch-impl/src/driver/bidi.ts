import {
  type BidiDriverComponents,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-c11y/schemas";

export function buildBidiComponents(): Omit<BidiDriverComponents, "protocol"> {
  const handler = {
    get(_target: unknown, prop: string) {
      return () => {
        throw new UnsupportedOperationError(
          `BiDi is not supported over HTTP: ${prop}`,
        );
      };
    },
  };
  const domain = new Proxy({}, handler);
  return new Proxy({}, { get: () => domain }) as never;
}
