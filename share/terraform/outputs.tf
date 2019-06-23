output "aws_region" {
  value = var.aws_region

  sensitive = true
}

output "aws_vpc_id" {
  value = module.github-handyman.aws_vpc_id

  sensitive = true
}

output "aws_subnet_ids" {
  value = module.github-handyman.aws_subnet_ids

  sensitive = true
}

output "aws_security_group_ids" {
  value = module.github-handyman.aws_security_group_ids

  sensitive = true
}
