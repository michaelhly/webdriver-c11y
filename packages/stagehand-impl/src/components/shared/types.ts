import type { Stagehand } from "@browserbasehq/stagehand";

// Page/Locator types are not re-exported from stagehand's public API
type Page = NonNullable<ReturnType<Stagehand["context"]["activePage"]>>;
type Locator = ReturnType<Page["locator"]>;

export type { Locator, Page };
