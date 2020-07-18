import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as example from "../lib/06-cdk-pipeline-deploy-to-environment-stack";

// test("Empty Stack", () => {
//   const app = new cdk.App();
//   // WHEN
//   const stack = new example.CdkPipelineStack(app, "MyTestStack");
//   // THEN
//   expectCDK(stack).to(
//     matchTemplate(
//       {
//         Resources: {},
//       },
//       MatchStyle.EXACT
//     )
//   );
// });
