import * as cdk from "@aws-cdk/core";
import * as elasticBeanstalk from "@aws-cdk/aws-elasticbeanstalk";

export class EnvironmentUsingSpotInstancesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const applicationName = "03-Application";
    const environmentName = "03-Environment";
    const solutionStackName =
      "64bit Amazon Linux 2018.03 v2.10.9 running Java 8";

    const application = new elasticBeanstalk.CfnApplication(
      this,
      "Application",
      {
        applicationName: applicationName,
      }
    );

    // https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.as.html#environments-cfg-autoscaling-spot
    const optionSettingProperties: elasticBeanstalk.CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: "aws:ec2:instances",
        optionName: "EnableSpot",
        value: "true",
      },
      {
        namespace: "aws:ec2:instances",
        optionName: "InstanceTypes",
        value: "t2.micro,t3.micro,t3.small",
      },
      {
        namespace: "aws:ec2:instances",
        optionName: "SpotFleetOnDemandBase",
        value: "0", // 0 = 100% Spot
      },
      {
        namespace: "aws:ec2:instances",
        optionName: "SpotFleetOnDemandAboveBasePercentage",
        value: "0", // 0 = 100% Spot
      },
    ];

    const environment = new elasticBeanstalk.CfnEnvironment(
      this,
      "Environment",
      {
        environmentName: environmentName,
        applicationName: applicationName,
        solutionStackName: solutionStackName,
        optionSettings: optionSettingProperties,
      }
    );
    environment.addDependsOn(application);
  }
}
