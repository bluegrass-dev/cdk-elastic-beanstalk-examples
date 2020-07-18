import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as s3 from "@aws-cdk/aws-s3";

export interface CdkPipelineStackProps extends StackProps {
  GitHubOrganization: string;
  GitHubRepo: string;
  GitHubBranch: string;
  GitHubPathToProject: string;
  GitHubPathArtifactName: string;
}

/**
 * The stack that defines the application pipeline
 */
export class CdkPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: CdkPipelineStackProps) {
    super(scope, id, props);

    const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket", {
      versioned: true, // required for CodePipeline source
    });

    const build = new codebuild.Project(this, "Build", {
      source: codebuild.Source.gitHub({
        owner: props.GitHubOrganization,
        repo: props.GitHubRepo,
        webhook: true,
        webhookFilters: [
          codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH)
            .andBranchIs(props.GitHubBranch)
            .andFilePathIs(props.GitHubPathToProject),
        ],
      }),
      artifacts: codebuild.Artifacts.s3({
        bucket: artifactsBucket,
        includeBuildId: false,
        packageZip: true,
        path: "code",
        identifier: "RepoArtifact",
      }),
      environmentVariables: {
        GitHubPathToProject: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: props.GitHubPathToProject,
        },
        ArtifactName: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: props.GitHubPathArtifactName,
        },
        ArtifactsBucket: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: artifactsBucket.bucketName,
        },
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          build: {
            commands: [
              "cd ${CODEBUILD_SRC_DIR}",
              "zip -qr ${ArtifactName} ./${GitHubPathToProject}",
              "aws s3 cp ${CODEBUILD_SRC_DIR}/${ArtifactName} s3://${ArtifactsBucket}/code/${ArtifactName}",
            ],
          },
        },
      }),
    });

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();
    const pipeline = new CdkPipeline(this, "Pipeline", {
      // The pipeline name
      pipelineName: "06CDKPipelineToEnvironment",
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.S3SourceAction({
        actionName: "S3Source",
        bucket: artifactsBucket,
        bucketKey: `code/${props.GitHubPathArtifactName}`,
        output: sourceArtifact,
      }),

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,

        // We need a build step to compile the TypeScript Lambda
        buildCommand: "ls -al && npm run build",
      }),
    });

    // This is where we add the application stages
    // ...
  }
}
