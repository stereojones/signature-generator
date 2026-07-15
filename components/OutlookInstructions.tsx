"use client";

type OutlookInstructionsProps = {
  open: boolean;
};

export function OutlookInstructions({ open }: OutlookInstructionsProps) {
  if (!open) return null;

  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="amelia-body">
        Use the <strong>Copy Signature</strong>{" "}
        button above, then paste into
        Outlook&apos;s signature editor.
      </p>

      <ol className="amelia-body mt-4 list-decimal space-y-3 pl-5">
        <li>
          Click <strong>Copy Signature</strong> on this page.
        </li>
        <li>
          Open Outlook and go to your signature settings:
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Windows (classic):</strong> File → Options → Mail →
              Signatures…
            </li>
            <li>
              <strong>Mac:</strong> Outlook → Settings → Signatures
            </li>
            <li>
              <strong>New Outlook:</strong> Settings → Mail → Signatures
            </li>
            <li>
              <strong>Outlook on the web:</strong> Settings → Account →
              Signatures. If you&apos;re already signed in, open{" "}
              <a
                href="https://outlook.office.com/mail/options/accounts-category/signatures-subcategory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                outlook.office.com/mail/options/accounts-category/signatures-subcategory
              </a>
              .
            </li>
          </ul>
        </li>
        <li>Create a new signature or select an existing one to edit.</li>
        <li>
          Click inside the signature editor and paste (
          <strong>Ctrl+V</strong> on Windows, <strong>Cmd+V</strong> on Mac).
        </li>
        <li>Save your changes and set the signature as the default if needed.</li>
      </ol>

      <p className="amelia-helper mt-4">
        Tip: You can also select the white preview area above and copy manually,
        but the button is the most reliable method.
      </p>
    </div>
  );
}
