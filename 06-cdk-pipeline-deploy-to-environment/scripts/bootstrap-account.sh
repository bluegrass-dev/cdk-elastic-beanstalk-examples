#!/usr/bin/env bash

npx cdk bootstrap \
    --profile "$AWS_PROFILE" \
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
    aws://"$AWS_ACCOUNT_ID"/"$AWS_REGION"