import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as example from "../lib/01-creating-an-application-stack";

test("ElasticBeanstalk Application Created", () => {
  const app = new cdk.App();
  const stack = new example.CreatingAnApplicationStack(app, "MyTestStack");
  expectCDK(stack).to(haveResource("AWS::ElasticBeanstalk::Application"));
});
