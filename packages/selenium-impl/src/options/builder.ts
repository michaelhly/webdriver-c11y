export interface OptionsBuilder<TOptions> {
	readonly vendor: string;
	build(): TOptions;
}
