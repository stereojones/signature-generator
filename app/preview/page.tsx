import { SignaturePreviewSample } from "@/components/SignaturePreview";
import { getAllTemplates } from "@/lib/templates";

export default function PreviewPage() {
  const templates = getAllTemplates(true);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-16 lg:py-16">
      <h1 className="amelia-page-title">Template Preview (Dev)</h1>
      <p className="amelia-body mb-8 mt-2">
        Sample data preview for template finalization review.
      </p>
      <div className="space-y-4">
        {templates.map((template) => (
          <section key={template.id} className="amelia-card-padded">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="amelia-heading-4">{template.name}</h2>
              <span className="amelia-badge amelia-badge-neutral">
                {template.status}
              </span>
            </div>
            <SignaturePreviewSample html={template.html} templateId={template.id} />
          </section>
        ))}
      </div>
    </div>
  );
}
