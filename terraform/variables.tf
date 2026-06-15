variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region for Cloud Run and Artifact Registry"
  type        = string
  default     = "us-central1"
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "signature-generator"
}

variable "github_repo" {
  description = "GitHub repository in org/repo format for Workload Identity Federation"
  type        = string
}

variable "allow_public_headshots" {
  description = "Allow public read access to headshot objects in GCS"
  type        = bool
  default     = true
}

variable "cloud_run_invokers" {
  description = "Members granted roles/run.invoker on Cloud Run (e.g. group:team@company.com)"
  type        = list(string)
  default     = []
}
