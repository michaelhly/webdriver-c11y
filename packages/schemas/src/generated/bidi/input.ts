// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverBidiInput`'s JSON-Schema
 * via the `definition` "SourceActionType".
 */
export type SourceActionType = "none" | "key" | "pointer" | "wheel";
/**
 * This interface was referenced by `WebdriverBidiInput`'s JSON-Schema
 * via the `definition` "PointerType".
 */
export type PointerType = "mouse" | "pen" | "touch";

/**
 * This interface was referenced by `WebdriverBidiInput`'s JSON-Schema
 * via the `definition` "KeyAction".
 */
export interface KeyAction {
  type: "keyDown" | "keyUp" | "pause";
  value?: string;
  duration?: number;
}
/**
 * This interface was referenced by `WebdriverBidiInput`'s JSON-Schema
 * via the `definition` "PointerAction".
 */
export interface PointerAction {
  type: "pointerDown" | "pointerUp" | "pointerMove" | "pause";
  button?: number;
  x?: number;
  y?: number;
  duration?: number;
  width?: number;
  height?: number;
  pressure?: number;
  tangentialPressure?: number;
  twist?: number;
  altitudeAngle?: number;
  azimuthAngle?: number;
  origin?: unknown;
}
/**
 * This interface was referenced by `WebdriverBidiInput`'s JSON-Schema
 * via the `definition` "WheelAction".
 */
export interface WheelAction {
  type: "scroll" | "pause";
  x?: number;
  y?: number;
  deltaX?: number;
  deltaY?: number;
  duration?: number;
  origin?: unknown;
}
/**
 * This interface was referenced by `WebdriverBidiInput`'s JSON-Schema
 * via the `definition` "SourceActions".
 */
export interface SourceActions {
  type: SourceActionType;
  id: string;
  parameters?: {
    pointerType?: PointerType;
  };
  actions: unknown[];
}
/**
 * This interface was referenced by `WebdriverBidiInput`'s JSON-Schema
 * via the `definition` "PerformActionsParams".
 */
export interface PerformActionsParams {
  context: string;
  actions: SourceActions[];
}
/**
 * This interface was referenced by `WebdriverBidiInput`'s JSON-Schema
 * via the `definition` "ReleaseActionsParams".
 */
export interface ReleaseActionsParams {
  context: string;
}
/**
 * This interface was referenced by `WebdriverBidiInput`'s JSON-Schema
 * via the `definition` "SetFilesParams".
 */
export interface SetFilesParams {
  context: string;
  element: unknown;
  files: string[];
}
