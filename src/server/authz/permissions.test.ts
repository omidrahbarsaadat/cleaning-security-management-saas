import { describe, expect, it } from "vitest";
import { isPermission, PERMISSIONS, ROLE_TEMPLATES } from "@/server/authz/permissions";

describe("role templates", () => {
  it("only reference known permissions", () => {
    for (const permissions of Object.values(ROLE_TEMPLATES)) {
      expect(permissions.every(isPermission)).toBe(true);
    }
  });

  it("reserve organization management for owners", () => {
    const holders = Object.entries(ROLE_TEMPLATES)
      .filter(([, permissions]) => permissions.includes("organization:manage"))
      .map(([key]) => key);
    expect(holders).toEqual(["owner"]);
  });

  it("keep the employee template read-only", () => {
    expect(ROLE_TEMPLATES.employee.every((p) => p.endsWith(":read"))).toBe(true);
  });

  it("have no duplicate permissions in the catalog", () => {
    expect(new Set(PERMISSIONS).size).toBe(PERMISSIONS.length);
  });
});
