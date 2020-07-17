#!/usr/bin/env bash

aws secretsmanager create-secret \
    --name github-token \
    --secret-string "$GITHUB_TOKEN" \
    --region "$AWS_REGION"