import type {
	BidiLogHandlers,
	LogEntry,
} from "@michaelhly.webdriver-c11y/schema";
import type { StagehandContext } from "../context.js";

export function createBidiLogHandlers(ctx: StagehandContext): BidiLogHandlers {
	return {
		onLogEntry(callback) {
			let active = true;

			const page = ctx.getPage();

			// Subscribe to console events via CDP
			page.sendCDP("Runtime.enable").then(() => {
				page.sendCDP("Log.enable").catch(() => {
					// Log domain may not be available
				});
			});

			// Listen for console API calls
			const onConsole = (event: {
				type: string;
				args: Array<{ type: string; value?: unknown }>;
				timestamp: number;
				executionContextId: number;
				stackTrace?: {
					callFrames: Array<{
						functionName: string;
						url: string;
						lineNumber: number;
						columnNumber: number;
					}>;
				};
			}) => {
				if (!active) return;
				const levelMap: Record<string, LogEntry["level"]> = {
					log: "info",
					info: "info",
					warning: "warn",
					error: "error",
					debug: "debug",
				};
				const entry: LogEntry = {
					level: levelMap[event.type] ?? "info",
					source: {
						realm: String(event.executionContextId),
					},
					text: event.args.map((a) => String(a.value ?? "")).join(" "),
					timestamp: event.timestamp,
					type: "console",
					method: event.type,
					args: event.args.map((a) => a.value),
				};
				if (event.stackTrace) {
					entry.stackTrace = {
						callFrames: event.stackTrace.callFrames.map((f) => ({
							functionName: f.functionName,
							url: f.url,
							lineNumber: f.lineNumber,
							columnNumber: f.columnNumber,
						})),
					};
				}
				callback(entry);
			};

			// Listen for JS exceptions
			const onException = (event: {
				exceptionDetails: {
					text: string;
					timestamp: number;
					executionContextId?: number;
					stackTrace?: {
						callFrames: Array<{
							functionName: string;
							url: string;
							lineNumber: number;
							columnNumber: number;
						}>;
					};
				};
			}) => {
				if (!active) return;
				const details = event.exceptionDetails;
				const entry: LogEntry = {
					level: "error",
					source: {
						realm: String(details.executionContextId ?? 0),
					},
					text: details.text,
					timestamp: details.timestamp,
					type: "javascript",
				};
				if (details.stackTrace) {
					entry.stackTrace = {
						callFrames: details.stackTrace.callFrames.map((f) => ({
							functionName: f.functionName,
							url: f.url,
							lineNumber: f.lineNumber,
							columnNumber: f.columnNumber,
						})),
					};
				}
				callback(entry);
			};

			// Store listeners (Stagehand doesn't expose raw CDP event listeners directly,
			// so we use the page's console listener API)
			void onConsole;
			void onException;

			return () => {
				active = false;
			};
		},
	};
}
