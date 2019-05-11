terraform {
  required_version = ">= 0.9.3, != 0.9.5"

  backend "s3" {}
}

provider "aws" {
  region  = "${var.aws_region}"
  version = "1.60"
}
