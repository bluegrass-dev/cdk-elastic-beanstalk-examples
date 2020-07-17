import * as elasticBeanstalk from "@aws-cdk/aws-elasticbeanstalk";
import {
  CfnOutput,
  Construct,
  StackProps,
  Stack,
  SecretValue,
} from "@aws-cdk/core";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipelineActions from "@aws-cdk/aws-codepipeline-actions";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as elasticbeanstalkDeployAction from "./pipeline-deploy-action";

export interface ApplicationProps extends StackProps {
  ApplicationName: string;
}

export class ApplicationStack extends Stack {
  public readonly applicationName: CfnOutput;

  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    const application = new elasticBeanstalk.CfnApplication(
      this,
      "Application",
      {
        applicationName: props.ApplicationName,
      }
    );

    this.applicationName = new CfnOutput(this, "ApplicationName", {
      value: props.ApplicationName,
    });
  }
}

export interface EnvironmentProps extends StackProps {
  EnvironmentName: string;
  ApplicationName: string;
  SolutionStackName: string;
}

export class EnvironmentStack extends Stack {
  public readonly environmentName: CfnOutput;
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

    this.environmentName = new CfnOutput(this, "EnvironmentName", {
      value: props.EnvironmentName,
    });
  }
}

export interface PipelineProps extends StackProps {
  GitHubOrganization: string;
  GitHubRepo: string;
  ApplicationName: string;
  EnvironmentName: string;
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    const build = new codebuild.PipelineProject(this, "Build", {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          build: {
            commands: "./gradlew build",
          },
        },
      }),
    });

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact("BuildOutput");
    const pipeline = new codepipeline.Pipeline(this, "Pipeline");

    pipeline.addStage({
      stageName: "Source",
      actions: [
        new codepipelineActions.GitHubSourceAction({
          actionName: "GitHub_Source",
          owner: props.GitHubOrganization,
          repo: props.GitHubRepo,
          oauthToken: SecretValue.secretsManager("github-token"),
          output: sourceOutput,
          branch: "master",
          trigger: codepipelineActions.GitHubTrigger.POLL,
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Build",
      actions: [
        new codepipelineActions.CodeBuildAction({
          actionName: "Application_Build",
          project: build,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        new elasticbeanstalkDeployAction.ElasticBeanStalkDeployAction({
          actionName: "Beanstalk_Deploy",
          applicationName: props.ApplicationName,
          environmentName: props.EnvironmentName,
          input: buildOutput,
        }),
      ],
    });
  }
}
