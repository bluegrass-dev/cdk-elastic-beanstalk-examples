import * as cdk from "@aws-cdk/core";
import * as elasticBeanstalk from "@aws-cdk/aws-elasticbeanstalk";

export class CreatingAnApplicationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const application = new elasticBeanstalk.CfnApplication(
      this,
      "Application",
      {
        applicationName: "01-Application",
      }
    );
  }
}
