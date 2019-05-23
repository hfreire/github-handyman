terraform {
  required_version = ">= 0.9.3, != 0.9.5"

  backend "s3" {}
}

provider "aws" {
  region  = "${var.aws_region}"
  version = "1.60"
}

data "aws_vpc" "selected" {
  tags {
    Name = "${var.infrastructure_name}"
  }
}

data "aws_subnet_ids" "selected" {
  vpc_id = "${data.aws_vpc.selected.id}"

  tags {
    IsPrivateSubnet = true
  }
}

data "aws_security_groups" "selected" {
  tags = {
    IsAntifragile = true
    Name          = "serverless"
  }
}
