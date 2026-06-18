import { SignaturePreviewSample } from "@/components/SignaturePreview";
import { getAllSignatureVariants } from "@/lib/templates";

export default function PreviewPage() {
  const signatures = getAllSignatureVariants(true);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-16 lg:py-16">
      <h1 className="amelia-page-title">Signature Preview (Dev)</h1>
      <p className="amelia-body mb-8 mt-2">
        Sample data preview for brand and headshot combinations.
      </p>
      <div className="space-y-4">
        {signatures.map((signature) => (
          <section key={signature.id} className="amelia-card-padded">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="amelia-heading-4">{signature.name}</h2>
                <p className="amelia-helper mt-0.5">{signature.description}</p>
              </div>
              <span className="amelia-badge amelia-badge-neutral">
                {signature.status}
              </span>
            </div>
            <SignaturePreviewSample
              html={signature.html}
              brandId={signature.brand.id}
              wantsHeadshot={signature.wantsHeadshot}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
