import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/safe-redirect";

describe("safeNextPath", () => {
  it.each(["/de/org/muster-dienste", "/en", "/fa/org/a-b/"])("accepts localized path %s", (path) => {
    expect(safeNextPath(path, "de")).toBe(path);
  });

  it.each([
    null,
    "",
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/de/../../evil",
    "/xx/org",
    "/de/org?x=https://evil.example",
    "javascript:alert(1)",
  ])("falls back to the locale home for %s", (path) => {
    expect(safeNextPath(path, "en")).toBe("/en");
  });
});
