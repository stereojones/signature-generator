"use client";

type GmailInstructionsProps = {
  open: boolean;
};

export function GmailInstructions({ open }: GmailInstructionsProps) {
  if (!open) return null;

  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="amelia-body">
        Gmail works best with the formatted signature. Use the{" "}
        <strong>Copy Signature</strong>{" "}
        button above, then paste into
        Gmail&apos;s signature editor.
      </p>

      <ol className="amelia-body mt-4 list-decimal space-y-3 pl-5">
        <li>
          Click <strong>Copy Signature</strong> on this page.
        </li>
        <li>
          Open Gmail and click the <strong>Settings</strong> gear icon in the
          top-right corner.
        </li>
        <li>
          Click <strong>See all settings</strong>.
        </li>
        <li>
          Scroll to the <strong>Signature</strong> section (under the General
          tab).
        </li>
        <li>
          Click <strong>Create new</strong>, enter a name for your signature,
          then click <strong>Create</strong>.
        </li>
        <li>
          Click inside the signature editor and paste (
          <strong>Ctrl+V</strong> on Windows, <strong>Cmd+V</strong> on Mac).
        </li>
        <li>
          Scroll to the bottom of the page and click{" "}
          <strong>Save Changes</strong>.
        </li>
      </ol>

      <p className="amelia-helper mt-4">
        Tip: If images do not appear right away, wait a moment after pasting
        before saving. Gmail may need a second to load images from the web.
      </p>
    </div>
  );
}
