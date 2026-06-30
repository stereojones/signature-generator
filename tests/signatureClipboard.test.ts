import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  stripSignatureStyleBlock,
  wrapSignatureForOfficePaste,
} from "../lib/signatureClipboard";

describe("signatureClipboard", () => {
  it("strips the leading style block from rendered HTML", () => {
    const html =
      "<style type=\"text/css\">@import url('fonts');</style><table><tr><td>Name</td></tr></table>";
    assert.equal(
      stripSignatureStyleBlock(html),
      "<table><tr><td>Name</td></tr></table>",
    );
  });

  it("wraps signature content with a white background for Office paste", () => {
    const wrapped = wrapSignatureForOfficePaste(
      "<style></style><p>Hello</p>",
    );
    assert.match(wrapped, /background-color:#ffffff/);
    assert.match(wrapped, /<!--StartFragment-->/);
    assert.match(wrapped, /<p>Hello<\/p>/);
    assert.doesNotMatch(wrapped, /<style/);
  });
});
