import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { limitSampleContactFields } from "../lib/sampleData";

describe("limitSampleContactFields", () => {
  it("keeps at most three filled contact fields in preview sample data", () => {
    const limited = limitSampleContactFields({
      officePhone: "(636) 329-4036",
      cellPhone: "(314) 687-8249",
      email: "name@example.com",
      emailHref: "mailto:name@example.com",
      website: "askamelia.com",
      websiteHref: "https://askamelia.com",
    });

    const filled = [
      limited.officePhone,
      limited.cellPhone,
      limited.email,
      limited.website,
      limited.instagram,
    ].filter(Boolean);

    assert.equal(filled.length, 3);
    assert.equal(limited.website, "");
    assert.equal(limited.websiteHref, "");
  });
});
