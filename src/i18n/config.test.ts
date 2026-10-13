import { describe, expect, it } from "vitest";
import { getDirection, isLocale, locales } from "./config";

describe("localization configuration", () => {
  it("supports German, Persian, and English", () => {
    expect(locales).toEqual(["de", "fa", "en"]);
  });

  it("marks Persian as RTL and German and English as LTR", () => {
    expect(getDirection("fa")).toBe("rtl");
    expect(getDirection("de")).toBe("ltr");
    expect(getDirection("en")).toBe("ltr");
  });

  it("rejects unsupported locales", () => {
    expect(isLocale("de")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
});
