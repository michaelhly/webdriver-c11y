export class DriverError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class SessionNotCreatedError extends DriverError {}
export class NoSuchElementError extends DriverError {}
export class StaleElementReferenceError extends DriverError {}
export class ElementNotInteractableError extends DriverError {}
export class NoSuchAlertError extends DriverError {}
export class NoSuchWindowError extends DriverError {}
export class ScriptTimeoutError extends DriverError {}
export class TimeoutError extends DriverError {}
export class InvalidSelectorError extends DriverError {}
export class UnsupportedOperationError extends DriverError {}
