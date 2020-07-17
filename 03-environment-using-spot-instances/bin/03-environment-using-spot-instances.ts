#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { EnvironmentUsingSpotInstancesStack } from "../lib/03-environment-using-spot-instances-stack";

const app = new cdk.App();
new EnvironmentUsingSpotInstancesStack(
  app,
  "EnvironmentUsingSpotInstancesStack"
);
