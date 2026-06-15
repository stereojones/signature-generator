resource "google_artifact_registry_repository" "app" {
  location      = var.region
  repository_id = var.app_name
  description   = "Docker images for ${var.app_name}"
  format        = "DOCKER"

  depends_on = [google_project_service.required]
}

resource "google_service_account" "runtime" {
  account_id   = "${var.app_name}-runtime"
  display_name = "${var.app_name} Cloud Run runtime"
}

resource "google_service_account" "deploy" {
  account_id   = "${var.app_name}-deploy"
  display_name = "${var.app_name} GitHub Actions deploy"
}

resource "google_cloud_run_v2_service" "app" {
  name     = var.app_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.runtime.email

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}/${var.app_name}:latest"

      env {
        name  = "GCS_BUCKET_NAME"
        value = google_storage_bucket.headshots.name
      }

      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
  }

  depends_on = [
    google_project_service.required,
    google_artifact_registry_repository.app,
  ]

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
    ]
  }
}

resource "google_cloud_run_v2_service_iam_member" "invokers" {
  for_each = toset(var.cloud_run_invokers)

  project  = var.project_id
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = each.value
}

output "cloud_run_url" {
  value       = google_cloud_run_v2_service.app.uri
  description = "Cloud Run service URL"
}

output "gcs_bucket_name" {
  value       = google_storage_bucket.headshots.name
  description = "GCS bucket for headshot uploads"
}

output "artifact_registry" {
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}"
  description = "Artifact Registry repository path"
}

output "runtime_service_account" {
  value       = google_service_account.runtime.email
  description = "Cloud Run runtime service account"
}

output "deploy_service_account" {
  value       = google_service_account.deploy.email
  description = "GitHub Actions deploy service account"
}
