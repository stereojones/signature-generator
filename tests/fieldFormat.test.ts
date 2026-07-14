import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatPhoneNumber,
  isValidPhoneNumber,
  isValidWebsite,
  normalizeEmailDisplay,
  normalizeEmailHref,
  normalizeInstagramDisplay,
  normalizeWebsiteDisplay,
  normalizeWebsiteHref,
} from "../lib/fieldFormat";
import { prepareSignatureData } from "../lib/renderSignature";
import {
  validateContactFieldLimit,
  validateFormField,
} from "../lib/validation";

describe("formatPhoneNumber", () => {
  it("formats 10-digit numbers", () => {
    assert.equal(formatPhoneNumber("6363294036"), "(636) 329-4036");
    assert.equal(formatPhoneNumber("(636) 329-4036"), "(636) 329-4036");
    assert.equal(formatPhoneNumber("1-636-329-4036"), "(636) 329-4036");
  });
});

describe("isValidPhoneNumber", () => {
  it("accepts common phone input formats", () => {
    assert.equal(isValidPhoneNumber("6363294036"), true);
    assert.equal(isValidPhoneNumber("(636) 329-4036"), true);
    assert.equal(isValidPhoneNumber("636-329"), false);
  });
});

describe("normalizeWebsite", () => {
  it("strips protocol and www for display", () => {
    assert.equal(
      normalizeWebsiteDisplay("https://www.askamelia.com/about"),
      "askamelia.com/about",
    );
    assert.equal(normalizeWebsiteDisplay("askamelia.com"), "askamelia.com");
  });

  it("builds href with https and without www", () => {
    assert.equal(
      normalizeWebsiteHref("www.askamelia.com/contact"),
      "https://askamelia.com/contact",
    );
  });
});

describe("normalizeInstagramDisplay", () => {
  it("strips @ and instagram URLs", () => {
    assert.equal(normalizeInstagramDisplay("@amelia.aesthetics"), "amelia.aesthetics");
    assert.equal(
      normalizeInstagramDisplay("https://instagram.com/amelia.aesthetics/"),
      "amelia.aesthetics",
    );
  });
});

describe("normalizeEmail", () => {
  it("normalizes display and mailto href", () => {
    assert.equal(normalizeEmailDisplay(" Name@Example.COM "), "name@example.com");
    assert.equal(normalizeEmailHref("name@example.com"), "mailto:name@example.com");
  });
});

describe("validateFormField", () => {
  it("accepts website domains without protocol", () => {
    assert.equal(validateFormField("askamelia.com", false, "url", "website"), null);
    assert.equal(
      validateFormField("not a url", false, "url", "website"),
      "Enter a valid website (e.g. askamelia.com)",
    );
  });

  it("validates phone numbers", () => {
    assert.equal(validateFormField("6363294036", false, "tel", "officePhone"), null);
    assert.equal(
      validateFormField("123", false, "tel", "officePhone"),
      "Enter a 10-digit US phone number",
    );
  });
});

describe("validateContactFieldLimit", () => {
  it("allows up to three filled contact fields", () => {
    assert.equal(
      validateContactFieldLimit({
        officePhone: "(636) 329-4036",
        cellPhone: "(314) 687-8249",
        website: "askamelia.com",
        instagram: "",
      }),
      null,
    );
  });

  it("rejects more than three filled contact fields", () => {
    assert.match(
      validateContactFieldLimit({
        officePhone: "(636) 329-4036",
        cellPhone: "(314) 687-8249",
        website: "askamelia.com",
        instagram: "amelia.aesthetics",
      }) ?? "",
      /up to 3 contact fields/i,
    );
  });
});

describe("prepareSignatureData", () => {
  it("normalizes contact fields for signature output", () => {
    const prepared = prepareSignatureData({
      officePhone: "6363294036",
      cellPhone: "3146878249",
      email: "Name@Example.COM",
      website: "https://www.askamelia.com",
      instagram: "@amelia.aesthetics",
    });

    assert.equal(prepared.officePhone, "(636) 329-4036");
    assert.equal(prepared.cellPhone, "(314) 687-8249");
    assert.equal(prepared.email, "name@example.com");
    assert.equal(prepared.emailHref, "mailto:name@example.com");
    assert.equal(prepared.website, "askamelia.com");
    assert.equal(prepared.websiteHref, "https://askamelia.com");
    assert.equal(prepared.instagram, "amelia.aesthetics");
    assert.equal(prepared.instagramHref, "https://instagram.com/amelia.aesthetics");
  });
});
