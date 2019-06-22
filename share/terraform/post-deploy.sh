terraform output -json | jq 'with_entries(.value |= .value)' > terraform.json
