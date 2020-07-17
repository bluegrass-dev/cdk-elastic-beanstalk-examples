import codepipeline = require("@aws-cdk/aws-codepipeline");
import iam = require("@aws-cdk/aws-iam");
import events = require("@aws-cdk/aws-events");
import { Construct } from "@aws-cdk/core";

// https://github.com/aws/aws-cdk/issues/2516
export interface ElasticBeanStalkDeployActionProps
  extends codepipeline.CommonAwsActionProps {
  applicationName: string;

  environmentName: string;

  input: codepipeline.Artifact;
}

export class ElasticBeanStalkDeployAction implements codepipeline.IAction {
  public readonly actionProperties: codepipeline.ActionProperties;
  private readonly props: ElasticBeanStalkDeployActionProps;

  constructor(props: ElasticBeanStalkDeployActionProps) {
    this.actionProperties = {
      ...props,
      provider: "ElasticBeanstalk",
      category: codepipeline.ActionCategory.DEPLOY,
      artifactBounds: {
        minInputs: 1,
        maxInputs: 1,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: [props.input],
    };
    this.props = props;
  }

  public bind(
    _scope: Construct,
    _stage: codepipeline.IStage,
    options: codepipeline.ActionBindOptions
  ): codepipeline.ActionConfig {
    options.bucket.grantRead(options.role);

    options.role.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["elasticbeanstalk:CreateApplicationVersion"],
      })
    );

    return {
      configuration: {
        ApplicationName: this.props.applicationName,
        EnvironmentName: this.props.environmentName,
      },
    };
  }

  public onStateChange(
    _name: string,
    _target?: events.IRuleTarget,
    _options?: events.RuleProps
  ): events.Rule {
    throw new Error("unsupported");
  }
}
