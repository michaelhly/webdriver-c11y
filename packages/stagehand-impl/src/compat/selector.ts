import type { LocatorStrategy } from "@michaelhly.webdriver-interop/c11y";

export function toSelector(strategy: LocatorStrategy, value: string): string {
	switch (strategy) {
		case "css":
			return value;
		case "xpath":
			return `xpath/${value}`;
		case "id":
			return `[id="${escapeAttr(value)}"]`;
		case "name":
			return `[name="${escapeAttr(value)}"]`;
		case "tag-name":
			return value;
		case "class-name":
			return `.${value.replace(/ /g, ".")}`;
		case "link-text":
			return `xpath//a[normalize-space()=${xpathLiteral(value)}]`;
		case "partial-link-text":
			return `xpath//a[contains(normalize-space(),${xpathLiteral(value)})]`;
		case "text":
			return `xpath//*[normalize-space()=${xpathLiteral(value)}]`;
		case "role":
			return `[role="${escapeAttr(value)}"]`;
		case "label":
			return `[aria-label="${escapeAttr(value)}"]`;
		case "placeholder":
			return `[placeholder="${escapeAttr(value)}"]`;
	}
}

function escapeAttr(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function xpathLiteral(s: string): string {
	if (!s.includes("'")) return `'${s}'`;
	if (!s.includes('"')) return `"${s}"`;
	const parts = s
		.split("'")
		.map((p, i) => (i > 0 ? `"'",'${p}'` : `'${p}'`));
	return `concat(${parts.join(",")})`;
}
