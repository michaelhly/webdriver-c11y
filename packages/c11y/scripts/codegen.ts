import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { quicktype, InputData, JSONSchemaInput } from "quicktype-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = resolve(__dirname, "../schema");
const OUT_FILE = resolve(__dirname, "../src/generated/types.ts");

type SchemaObj = Record<string, unknown>;

function resolveRefs(obj: unknown): unknown {
	if (obj === null || typeof obj !== "object") return obj;
	if (Array.isArray(obj)) return obj.map(resolveRefs);

	const record = obj as Record<string, unknown>;
	const result: Record<string, unknown> = {};
	for (const [key, val] of Object.entries(record)) {
		if (key === "$ref" && typeof val === "string") {
			const hashIdx = val.indexOf("#");
			result[key] = hashIdx >= 0 ? val.slice(hashIdx) : val;
		} else {
			result[key] = resolveRefs(val);
		}
	}
	return result;
}

async function main() {
	const schemaFiles = readdirSync(SCHEMA_DIR).filter((f: string) =>
		f.endsWith(".json"),
	);

	// Merge all definitions from every schema file
	const allDefs: Record<string, SchemaObj> = {};
	for (const file of schemaFiles) {
		const raw = JSON.parse(
			readFileSync(join(SCHEMA_DIR, file), "utf-8"),
		) as SchemaObj;
		const defs = (raw.definitions ?? {}) as Record<string, SchemaObj>;
		for (const [name, schema] of Object.entries(defs)) {
			allDefs[name] = resolveRefs(schema) as SchemaObj;
		}
	}

	// Build a single root schema that exposes every definition as a property.
	// This lets quicktype process everything in one pass and deduplicate shared types.
	const rootProperties: Record<string, object> = {};
	const required: string[] = [];
	for (const name of Object.keys(allDefs)) {
		rootProperties[name] = { $ref: `#/definitions/${name}` };
		required.push(name);
	}

	const masterSchema = {
		$schema: "http://json-schema.org/draft-07/schema#",
		definitions: allDefs,
		type: "object",
		properties: rootProperties,
		required,
		additionalProperties: false,
	};

	const jsonInput = new JSONSchemaInput(undefined);
	await jsonInput.addSource({
		name: "C11ySchema",
		schema: JSON.stringify(masterSchema),
	});

	const inputData = new InputData();
	inputData.addInput(jsonInput);

	const result = await quicktype({
		inputData,
		lang: "typescript",
		rendererOptions: {
			"just-types": "true",
			"prefer-unions": "true",
			"acronym-style": "original",
		},
		alphabetizeProperties: false,
	});

	// Strip the root wrapper type from the output — we only want
	// the individual definition types.
	const lines = result.lines.join("\n");
	const stripped = lines.replace(
		/export interface C11[yY]Schema \{[^}]*\}\n*/s,
		"",
	);

	const header = [
		"// -----------------------------------------------------------------------",
		"// AUTO-GENERATED from JSON Schema files in schema/",
		"// Do not edit manually — run `pnpm generate` to regenerate.",
		"// -----------------------------------------------------------------------",
		"",
	].join("\n");

	writeFileSync(OUT_FILE, header + stripped, "utf-8");
	console.log(`Generated ${OUT_FILE}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
