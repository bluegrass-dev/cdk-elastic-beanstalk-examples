#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { CreatingAnApplicationStack } from "../lib/01-creating-an-application-stack";

const app = new cdk.App();
new CreatingAnApplicationStack(app, "CreatingAnApplicationStack");
