output "aws_region" {
  value = "${var.aws_region}"

  sensitive = true
}

output "aws_vpc_id" {
  value = "${data.aws_vpc.selected.id}"

  sensitive = true
}
