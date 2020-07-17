#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { CreatingAnEnvironmentStack } from "../lib/02-creating-an-environment-stack";

const app = new cdk.App();
new CreatingAnEnvironmentStack(app, "CreatingAnEnvironmentStack");
