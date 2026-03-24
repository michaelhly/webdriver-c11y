import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compileFromFile } from "json-schema-to-typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_DIR = resolve(__dirname, "../json");
const OUT_DIR = resolve(__dirname, "../src/generated");

const BANNER = [
	"// -----------------------------------------------------------------------",
	"// AUTO-GENERATED from JSON Schema files in json/",
	"// Do not edit manually — run `pnpm generate` to regenerate.",
	"// -----------------------------------------------------------------------",
].join("\n");

async function main() {
	const schemaFiles = readdirSync(JSON_DIR).filter((f: string) =>
		f.endsWith(".json"),
	);

	// Clean and recreate output directory
	rmSync(OUT_DIR, { recursive: true, force: true });
	mkdirSync(OUT_DIR, { recursive: true });

	for (const file of schemaFiles) {
		const stem = basename(file, ".json");
		const ts = await compileFromFile(join(JSON_DIR, file), {
			cwd: JSON_DIR,
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

		const outPath = join(OUT_DIR, `${stem}.ts`);
		writeFileSync(outPath, stripped, "utf-8");
		console.log(`Generated ${outPath}`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
