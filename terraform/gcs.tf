resource "google_storage_bucket" "headshots" {
  name                        = "${var.project_id}-${var.app_name}-headshots"
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = false

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST"]
    response_header = ["Content-Type", "Access-Control-Allow-Origin"]
    max_age_seconds = 3600
  }

  depends_on = [google_project_service.required]
}

resource "google_storage_bucket_iam_member" "headshots_public_read" {
  count  = var.allow_public_headshots ? 1 : 0
  bucket = google_storage_bucket.headshots.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_storage_bucket_iam_member" "runtime_upload" {
  bucket = google_storage_bucket.headshots.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.runtime.email}"
}
