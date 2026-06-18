import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildSignatureRenderData,
  escapeHtml,
  renderSignature,
} from "../lib/renderSignature";

describe("escapeHtml", () => {
  it("escapes special characters", () => {
    assert.equal(escapeHtml(`Tom & Jerry "test"`), "Tom &amp; Jerry &quot;test&quot;");
  });
});

describe("renderSignature", () => {
  const template = `
    <p>{{fullName}}</p>
    {{#phone}}<span>{{phone}}</span>{{/phone}}
    {{^phone}}<span>no phone</span>{{/phone}}
  `;

  it("replaces placeholders and escapes HTML", () => {
    const result = renderSignature(template, {
      fullName: "<script>alert(1)</script>",
      phone: "555-1234",
    });
    assert.match(result, /&lt;script&gt;/);
    assert.match(result, /555-1234/);
    assert.doesNotMatch(result, /no phone/);
  });

  it("handles empty optional fields", () => {
    const result = renderSignature(template, {
      fullName: "Jane Doe",
      phone: "",
    });
    assert.match(result, /no phone/);
    assert.doesNotMatch(result, /555/);
  });
});

describe("buildSignatureRenderData", () => {
  it("uses bottom valign when exactly two contact fields are filled", () => {
    const data = buildSignatureRenderData(
      {
        officePhone: "6363294036",
        website: "askamelia.com",
      },
      { brandId: "aesthetics" },
    );
    assert.equal(data.contactColumnValign, "bottom");
    assert.equal(data.brandAssetPrefix, "aesthetics");
  });

  it("uses top valign when fewer than two contact fields are filled", () => {
    const data = buildSignatureRenderData(
      { officePhone: "6363294036" },
      { brandId: "medspa" },
    );
    assert.equal(data.contactColumnValign, "top");
    assert.equal(data.brandAssetPrefix, "medspa");
  });
});
