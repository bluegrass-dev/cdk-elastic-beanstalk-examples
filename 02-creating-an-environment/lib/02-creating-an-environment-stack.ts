import * as cdk from "@aws-cdk/core";
import * as elasticBeanstalk from "@aws-cdk/aws-elasticbeanstalk";
import { CfnOutput } from "@aws-cdk/core";

export class CreatingAnEnvironmentStack extends cdk.Stack {
  public readonly environmentUrl: CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const applicationName = "02-Application";

    const application = new elasticBeanstalk.CfnApplication(
      this,
      "Application",
      {
        applicationName: applicationName,
      }
    );

    const environment = new elasticBeanstalk.CfnEnvironment(
      this,
      "Environment",
      {
        environmentName: "02-Environment",
        applicationName: applicationName,
        solutionStackName: "64bit Amazon Linux 2018.03 v2.10.9 running Java 8",
      }
    );
    environment.addDependsOn(application);

    this.environmentUrl = new CfnOutput(this, "EnvironmentUrl", {
      value: `http://${environment.attrEndpointUrl}`,
    });
  }
}
