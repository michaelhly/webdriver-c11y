import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compileFromFile } from "json-schema-to-typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_DIR = resolve(__dirname, "../json");
const BIDI_DIR = resolve(__dirname, "../json/bidi");
const OUT_DIR = resolve(__dirname, "../src/generated");
const BIDI_OUT_DIR = resolve(__dirname, "../src/generated/bidi");

const BANNER = [
	"// -----------------------------------------------------------------------",
	"// AUTO-GENERATED from JSON Schema files in json/",
	"// Do not edit manually — run `pnpm generate` to regenerate.",
	"// -----------------------------------------------------------------------",
].join("\n");

async function generateDir(inputDir: string, outputDir: string, cwd: string) {
	const schemaFiles = readdirSync(inputDir).filter((f: string) =>
		f.endsWith(".json"),
	);

	mkdirSync(outputDir, { recursive: true });

	for (const file of schemaFiles) {
		const stem = basename(file, ".json");
		const ts = await compileFromFile(join(inputDir, file), {
			cwd,
			bannerComment: BANNER,
			additionalProperties: false,
			unknownAny: true,
			format: false,
			unreachableDefinitions: true,
		});

		// Strip the root wrapper interface generated from the top-level schema object
		const stripped = ts.replace(
			/export interface Webdriver\w+ \{\n\[k: string\]: unknown\n\}\n?/g,
			"",
		);

		const outPath = join(outputDir, `${stem}.ts`);
		writeFileSync(outPath, stripped, "utf-8");
		console.log(`Generated ${outPath}`);
	}
}

async function main() {
	// Clean and recreate output directories
	rmSync(OUT_DIR, { recursive: true, force: true });

	await generateDir(JSON_DIR, OUT_DIR, JSON_DIR);
	await generateDir(BIDI_DIR, BIDI_OUT_DIR, BIDI_DIR);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
