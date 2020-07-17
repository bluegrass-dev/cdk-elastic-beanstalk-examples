import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as example from "../lib/02-creating-an-environment-stack";

test("ElasticBeanstalk Application Created", () => {
  const app = new cdk.App();
  const stack = new example.CreatingAnEnvironmentStack(app, "MyTestStack");
  expectCDK(stack).to(haveResource("AWS::ElasticBeanstalk::Application"));
});

test("ElasticBeanstalk Environment Created", () => {
  const app = new cdk.App();
  const stack = new example.CreatingAnEnvironmentStack(app, "MyTestStack");
  expectCDK(stack).to(haveResource("AWS::ElasticBeanstalk::Environment"));
});
