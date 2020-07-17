import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as example from "../lib/05-pipeline-to-single-environment-stack";

test("ElasticBeanstalk Application Created", () => {
  const app = new cdk.App();
  const stack = new example.ApplicationStack(app, "MyTestStack", {
    ApplicationName: "TestApp",
  });
  expectCDK(stack).to(haveResource("AWS::ElasticBeanstalk::Application"));
});

test("ElasticBeanstalk Environments Created", () => {
  const app = new cdk.App();
  const stack = new example.EnvironmentStack(app, "MyTestStack1", {
    ApplicationName: "05-Application",
    EnvironmentName: "05-Environment",
    SolutionStackName: "64bit Amazon Linux 2018.03 v2.10.9 running Java 8",
  });

  expectCDK(stack).to(
    haveResource("AWS::ElasticBeanstalk::Environment", {
      EnvironmentName: "05-Environment",
    })
  );
});

test("Pipeline created", () => {
  const app = new cdk.App();
  const stack = new example.PipelineStack(app, "MyTestStack", {
    ApplicationName: "05-Application",
    EnvironmentName: "05-Environment",
    GitHubOrganization: "bluegrass-dev",
    GitHubRepo: "eb-java-scorekeep",
  });

  expectCDK(stack).to(haveResource("AWS::CodePipeline::Pipeline"));
});
