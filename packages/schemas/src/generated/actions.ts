// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverActions`'s JSON-Schema
 * via the `definition` "SourceActionType".
 */
export type SourceActionType = "none" | "key" | "pointer" | "wheel";
/**
 * This interface was referenced by `WebdriverActions`'s JSON-Schema
 * via the `definition` "PointerType".
 */
export type PointerType = "mouse" | "pen" | "touch";

/**
 * This interface was referenced by `WebdriverActions`'s JSON-Schema
 * via the `definition` "NullAction".
 */
export interface NullAction {
  type: "pause";
  duration?: number;
}
/**
 * This interface was referenced by `WebdriverActions`'s JSON-Schema
 * via the `definition` "KeyAction".
 */
export interface KeyAction {
  type: "keyDown" | "keyUp" | "pause";
  value?: string;
  duration?: number;
}
/**
 * This interface was referenced by `WebdriverActions`'s JSON-Schema
 * via the `definition` "PointerAction".
 */
export interface PointerAction {
  type: "pointerDown" | "pointerUp" | "pointerMove" | "pointerCancel" | "pause";
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
 * This interface was referenced by `WebdriverActions`'s JSON-Schema
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
 * This interface was referenced by `WebdriverActions`'s JSON-Schema
 * via the `definition` "ActionSequence".
 */
export interface ActionSequence {
  type: SourceActionType;
  id: string;
  parameters?: {
    pointerType?: PointerType;
  };
  actions: unknown[];
}
/**
 * This interface was referenced by `WebdriverActions`'s JSON-Schema
 * via the `definition` "PerformActionsParams".
 */
export interface PerformActionsParams {
  actions: ActionSequence[];
}
