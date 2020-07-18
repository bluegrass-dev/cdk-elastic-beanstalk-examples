#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { CdkPipelineStack } from "../lib/06-cdk-pipeline-deploy-to-environment-stack";

const app = new cdk.App();
new CdkPipelineStack(app, "CdkPipelineDeployToEnvironmentStack", {
  GitHubOrganization: "bluegrass-dev",
  GitHubRepository: "cdk-elastic-beanstalk-examples",
});
