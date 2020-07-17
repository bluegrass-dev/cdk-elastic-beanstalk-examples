import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as example from "../lib/04-multiple-environments-stack";

test("ElasticBeanstalk Application Created", () => {
  const app = new cdk.App();
  const stack = new example.ApplicationStack(app, "MyTestStack", {
    ApplicationName: "TestApp",
  });
  expectCDK(stack).to(haveResource("AWS::ElasticBeanstalk::Application"));
});

test("ElasticBeanstalk Environments Created", () => {
  const app = new cdk.App();
  const stack1 = new example.EnvironmentStack(app, "MyTestStack1", {
    ApplicationName: "04-Application",
    EnvironmentName: "04-Environment-1",
    SolutionStackName: "64bit Amazon Linux 2018.03 v2.10.9 running Java 8",
  });

  const stack2 = new example.EnvironmentStack(app, "MyTestStack2", {
    ApplicationName: "04-Application",
    EnvironmentName: "04-Environment-2",
    SolutionStackName: "64bit Amazon Linux 2018.03 v2.10.9 running Java 8",
  });
  expectCDK(stack1).to(
    haveResource("AWS::ElasticBeanstalk::Environment", {
      EnvironmentName: "04-Environment-1",
    })
  );
  expectCDK(stack2).to(
    haveResource("AWS::ElasticBeanstalk::Environment", {
      EnvironmentName: "04-Environment-2",
    })
  );
});
