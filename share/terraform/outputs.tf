output "aws_region" {
  value = var.aws_region

  sensitive = true
}

output "aws_vpc_id" {
  value = data.aws_vpc.selected.id

  sensitive = true
}

output "aws_subnet_ids" {
  value = data.aws_subnet_ids.selected.ids

  sensitive = true
}

output "aws_security_group_ids" {
  value = data.aws_security_groups.selected.ids

  sensitive = true
}

