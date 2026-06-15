# Email Signature Generator

Internal tool for creating HTML email signatures. Users pick a template, enter personal info, crop a circular headshot, and copy the resulting HTML into their email client.

## Features

- 4-step wizard: template → info → headshot crop → copy HTML
- Circular avatar crop with zoom and preview (client-side, uploaded as PNG)
- Headshots hosted on GCS with permanent public URLs
- Template system with placeholder HTML and iterative finalization workflow
- Dev preview page at `/preview` for template QA with sample data

## Local development

### Prerequisites

- Node.js 22+
- A GCP project with a GCS bucket (for headshot uploads)
- [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials) configured locally

### Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your GCS bucket name
gcloud auth application-default login
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Template preview: [http://localhost:3000/preview](http://localhost:3000/preview).

### Environment variables

| Variable | Description |
|----------|-------------|
| `GCS_BUCKET_NAME` | GCS bucket for headshot uploads |
| `GCP_PROJECT_ID` | GCP project ID (optional locally) |

## Templates

Templates live in [`templates/`](templates/):

- `template-{1..4}.html` — email-safe HTML with `{{placeholders}}` and `{{#field}}...{{/field}}` conditionals
- [`config.ts`](templates/config.ts) — field definitions, headshot requirements, status
- [`TEMPLATE_STATUS.md`](templates/TEMPLATE_STATUS.md) — finalization tracking

Set `status: "finalized"` in config when a template is approved. In production, only finalized templates appear in the picker; dev shows all statuses.

## GCP infrastructure (Terraform)

Infrastructure is defined in [`terraform/`](terraform/):

- GCS bucket for headshots (public read on objects)
- Artifact Registry for Docker images
- Cloud Run service for the Next.js app
- Workload Identity Federation for GitHub Actions

### First-time bootstrap

1. Create a GCP project and enable billing
2. Copy `terraform/terraform.tfvars.example` to `terraform/terraform.tfvars` and fill in values
3. Apply locally with owner/editor credentials:

```bash
cd terraform
terraform init
terraform apply
```

4. Note outputs: `cloud_run_url`, `gcs_bucket_name`, `wif_provider`, `deploy_service_account`

### GitHub Actions setup

Configure these **repository variables**:

| Variable | Example |
|----------|---------|
| `GCP_PROJECT_ID` | `my-project-123` |
| `GCP_REGION` | `us-central1` |

Configure these **repository secrets**:

| Secret | Description |
|--------|-------------|
| `WIF_PROVIDER` | Terraform output `wif_provider` |
| `WIF_SERVICE_ACCOUNT` | Terraform output `deploy_service_account` |

### Internal access (no login)

Cloud Run is deployed with `--allow-unauthenticated=false`. Grant invoker access to your team:

```bash
gcloud run services add-iam-policy-binding signature-generator \
  --region=us-central1 \
  --member='group:engineering@yourcompany.com' \
  --role='roles/run.invoker'
```

Or set `cloud_run_invokers` in Terraform.

## CI/CD

- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): lint, typecheck, tests, build, Docker build on PRs and pushes to `main`
- **Deploy** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)): Terraform apply + Docker push + Cloud Run deploy on push to `main`

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npm test         # Unit tests
```

## Headshot upload flow

1. User selects a photo and crops it in a circular mask
2. Client renders a 256×256 PNG via canvas
3. Cropped blob is POSTed to `/api/upload`
4. Server validates and writes to `gs://<bucket>/headshots/<uuid>.png`
5. Public URL is embedded in the signature HTML

## Template finalization

See [`templates/TEMPLATE_STATUS.md`](templates/TEMPLATE_STATUS.md). Provide Figma frames or HTML exports; we iterate until each template passes visual and email-client QA, then mark it finalized.
