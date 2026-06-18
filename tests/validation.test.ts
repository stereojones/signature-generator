import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  validateContactFieldLimit,
  validateFormField,
} from "../lib/validation";

describe("validateContactFieldLimit", () => {
  it("requires at least two contact fields", () => {
    const result = validateContactFieldLimit({
      officePhone: "6363294036",
    });
    assert.match(result ?? "", /at least 2 contact fields/i);
  });

  it("allows two or three contact fields", () => {
    assert.equal(
      validateContactFieldLimit({
        officePhone: "6363294036",
        website: "askamelia.com",
      }),
      null,
    );
    assert.equal(
      validateContactFieldLimit({
        officePhone: "6363294036",
        cellPhone: "3146878249",
        instagram: "amelia.aesthetics",
      }),
      null,
    );
  });

  it("rejects more than three contact fields", () => {
    const result = validateContactFieldLimit({
      officePhone: "6363294036",
      cellPhone: "3146878249",
      website: "askamelia.com",
      instagram: "amelia.aesthetics",
    });
    assert.match(result ?? "", /up to 3 contact fields/i);
  });
});

describe("validateFormField location", () => {
  it("enforces max length", () => {
    const longLocation = "A".repeat(81);
    const result = validateFormField(longLocation, true, "text", "location");
    assert.match(result ?? "", /80 characters or fewer/i);
  });

  it("accepts valid location text", () => {
    assert.equal(
      validateFormField("Amelia Aesthetics Raleigh", true, "text", "location"),
      null,
    );
  });
});
