import type { Capabilities } from "@michaelhly.webdriver-c11y/schemas";

export type OptionsBuilder<T> = { build(): T };

type FromCapsClass<T> = new () => {
	readonly capKey: string;
	fromCapabilities(caps: Capabilities): T;
};

export function optionsBuilderFromVendorCaps<T>(
	Cls: FromCapsClass<T>,
	vendorCaps: Record<string, unknown>,
): OptionsBuilder<T> {
	const helper = new Cls();
	const caps = { [helper.capKey]: vendorCaps } as Capabilities;
	return {
		build(): T {
			return helper.fromCapabilities(caps);
		},
	};
}
