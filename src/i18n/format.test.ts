import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatNumber, formatTime } from "./format";

describe("locale-aware formatting", () => {
  it("formats numbers using the selected locale", () => {
    expect(formatNumber(1234.5, "de")).toBe("1.234,5");
    expect(formatNumber(1234.5, "en")).toBe("1,234.5");
  });

  it("formats currencies as EUR by default", () => {
    expect(formatCurrency(39, "de")).toContain("39,00");
    expect(formatCurrency(39, "de")).toContain("€");
    expect(formatCurrency(39, "en")).toContain("€");
  });

  it("formats dates and times for the selected locale", () => {
    const value = new Date("2026-01-02T15:04:00.000Z");
    expect(formatDate(value, "de", { dateStyle: "short", timeZone: "UTC" })).toBe("02.01.26");
    expect(formatTime(value, "en", { timeStyle: "short", timeZone: "UTC" })).toBe("3:04 PM");
  });
});
