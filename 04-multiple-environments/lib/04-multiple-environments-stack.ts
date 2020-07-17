import * as elasticBeanstalk from "@aws-cdk/aws-elasticbeanstalk";
import { CfnOutput, Construct, StackProps, Stack } from "@aws-cdk/core";

export interface ApplicationProps extends StackProps {
  ApplicationName: string;
}

export class ApplicationStack extends Stack {
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    const application = new elasticBeanstalk.CfnApplication(
      this,
      "Application",
      {
        applicationName: props.ApplicationName,
      }
    );
  }
}

export interface EnvironmentProps extends StackProps {
  EnvironmentName: string;
  ApplicationName: string;
  SolutionStackName: string;
}

export class EnvironmentStack extends Stack {
  constructor(scope: Construct, id: string, props: EnvironmentProps) {
    super(scope, id, props);

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
        environmentName: props.EnvironmentName,
        applicationName: props.ApplicationName,
        solutionStackName: props.SolutionStackName,
        optionSettings: optionSettingProperties,
      }
    );
  }
}
