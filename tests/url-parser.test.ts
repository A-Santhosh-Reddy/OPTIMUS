import { describe, it, expect } from "vitest";
import { parseAndNormalizeUrl } from "@/lib/detection/url-parser";

describe("URL Parsing & Normalization Engine", () => {
  it("should normalize bare domains and parse correctly", () => {
    const result = parseAndNormalizeUrl("example.com");
    expect(result.isValid).toBe(true);
    expect(result.hostname).toBe("example.com");
    expect(result.registrableDomain).toBe("example.com");
    expect(result.isIpAddress).toBe(false);
  });

  it("should correctly identify direct IPv4 addresses", () => {
    const result = parseAndNormalizeUrl("http://192.168.1.1:8080/login");
    expect(result.isValid).toBe(true);
    expect(result.isIpAddress).toBe(true);
    expect(result.ipVersion).toBe("v4");
    expect(result.port).toBe("8080");
    expect(result.pathname).toBe("/login");
  });

  it("should parse multi-tier subdomains and extract registrable domain", () => {
    const result = parseAndNormalizeUrl("https://login.secure.auth.service.co.uk/account");
    expect(result.isValid).toBe(true);
    expect(result.hostname).toBe("login.secure.auth.service.co.uk");
    expect(result.registrableDomain).toBe("service.co.uk");
    expect(result.subdomain).toBe("login.secure.auth");
    expect(result.tld).toBe("co.uk");
  });

  it("should gracefully handle empty or malformed inputs without throwing exceptions", () => {
    const emptyResult = parseAndNormalizeUrl("");
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.errorMessage).toBeDefined();

    const invalidResult = parseAndNormalizeUrl("http://::invalid::");
    expect(invalidResult.isValid).toBe(false);
  });
});
