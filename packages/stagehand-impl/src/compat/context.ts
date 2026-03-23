import type { Stagehand } from "@browserbasehq/stagehand";

export interface ElementRef {
	selector: string;
	index: number;
}

export interface DialogState {
	type: string;
	message: string;
	defaultPrompt?: string;
}

export interface StagehandContext {
	stagehand: Stagehand;
	elements: Map<string, ElementRef>;
	dialog: DialogState | null;
	sessionId: string | null;
}
