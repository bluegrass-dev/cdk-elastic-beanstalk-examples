import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as example from "../lib/03-environment-using-spot-instances-stack";

test("ElasticBeanstalk Application Created", () => {
  const app = new cdk.App();
  const stack = new example.EnvironmentUsingSpotInstancesStack(
    app,
    "MyTestStack"
  );
  expectCDK(stack).to(haveResource("AWS::ElasticBeanstalk::Application"));
});

test("ElasticBeanstalk Environment Created", () => {
  const app = new cdk.App();
  const stack = new example.EnvironmentUsingSpotInstancesStack(
    app,
    "MyTestStack"
  );
  expectCDK(stack).to(haveResource("AWS::ElasticBeanstalk::Environment"));
});

test("ElasticBeanstalk Environment is using 100% Spot Instances", () => {
  const app = new cdk.App();
  const stack = new example.EnvironmentUsingSpotInstancesStack(
    app,
    "MyTestStack"
  );
  expectCDK(stack).to(
    haveResource("AWS::ElasticBeanstalk::Environment", {
      OptionSettings: [
        {
          Namespace: "aws:ec2:instances",
          OptionName: "EnableSpot",
          Value: "true",
        },
        {
          Namespace: "aws:ec2:instances",
          OptionName: "InstanceTypes",
          Value: "t2.micro,t3.micro,t3.small",
        },
        {
          Namespace: "aws:ec2:instances",
          OptionName: "SpotFleetOnDemandBase",
          Value: "0",
        },
        {
          Namespace: "aws:ec2:instances",
          OptionName: "SpotFleetOnDemandAboveBasePercentage",
          Value: "0",
        },
      ],
    })
  );
});
