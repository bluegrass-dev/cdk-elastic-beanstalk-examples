#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import {
  ApplicationStack,
  EnvironmentStack,
  PipelineStack,
} from "../lib/05-pipeline-to-single-environment-stack";

const app = new cdk.App();

const application = new ApplicationStack(app, "ApplicationStack", {
  ApplicationName: "05-Application",
});

const environment1 = new EnvironmentStack(app, "Environment1Stack", {
  ApplicationName: application.applicationName.value,
  EnvironmentName: `${application.applicationName.value}-Env-1`,
  SolutionStackName: "64bit Amazon Linux 2018.03 v2.10.9 running Java 8",
});

const pipeline = new PipelineStack(app, "PipelineStack", {
  ApplicationName: application.applicationName.value,
  EnvironmentName: environment1.environmentName.value,
  GitHubOrganization: "bluegrass-dev",
  GitHubRepo: "eb-java-scorekeep",
});
