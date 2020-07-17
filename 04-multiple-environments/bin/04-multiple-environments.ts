#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import {
  ApplicationStack,
  EnvironmentStack,
} from "../lib/04-multiple-environments-stack";

const app = new cdk.App();
new ApplicationStack(app, "ApplicationStack", {
  ApplicationName: "04-Application",
});

new EnvironmentStack(app, "Environment1Stack", {
  ApplicationName: "04-Application",
  EnvironmentName: "04-Environment-1",
  SolutionStackName: "64bit Amazon Linux 2018.03 v2.10.9 running Java 8",
});

new EnvironmentStack(app, "Environment2Stack", {
  ApplicationName: "04-Application",
  EnvironmentName: "04-Environment-2",
  SolutionStackName: "64bit Amazon Linux 2018.03 v2.10.9 running Java 8",
});
