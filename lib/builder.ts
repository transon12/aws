import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import * as codebuild from '@aws-cdk/aws-codebuild';
import { ComputeType } from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';

export class builderStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        //Create ACM Permission Policy
        const describeAcmCertificates = new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    resources: ['*'],
                    actions: [
                        "sts:AssumeRole",
                        "cloudformation:*",
                        "ec2:*",
                        "ssm:GetParameters",
                        "iam:*",
                        "autoscaling:*",
                        "elasticloadbalancing:*",
                        "cloudwatch:*"
                    ],
                }),
            ],
        });

        const codeBuildRole = new iam.Role(this, 'example-iam-role', {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
            description: 'An example IAM role in AWS CDK',
            inlinePolicies: {
                DescribeACMCerts: describeAcmCertificates,
            },
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    'AmazonAPIGatewayInvokeFullAccess',
                ),
            ],
        });

        new codebuild.Project(this, 'MyProject', {
            role: new iam.Role(this, "codebuild-role", {
                assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
                inlinePolicies: {
                    "codebuild-policies": new iam.PolicyDocument({
                        statements: [
                            new iam.PolicyStatement({
                                actions: [
                                    "ssm:GetParameters",
                                    "sts:AssumeRole",
                                    "iam:*",
                                    "ec2:*",
                                    "cloudformation:*",
                                    "autoscaling:*",
                                    "elasticloadbalancing:*",
                                ],
                                resources: ["*"],
                            }),
                        ],
                    }),
                },
            }),
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    build: {
                        commands: [
                            "npm install -g typescript",
                            "npm install -g aws-cdk@1.133",
                            "echo cdk -v",
                            "cdk --version",
                            "git clone https://github.com/transon12/aws.git",
                            "cd aws",
                            "npm install",
                            "cdk deploy VpcCreateNewStack  --require-approval never",
                            "export EC2_INSTANCE_ID=$(ec2metadata --instance-id)",
                            "echo EC2_INSTANCE_ID"
                        ],
                    },
                },
            }),
        });
    }
}
