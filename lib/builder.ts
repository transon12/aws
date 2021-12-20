import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');

export class builderStack extends cdk.Stack {
    public vpc: ec2.Vpc;
    public bastionSg: ec2.SecurityGroup;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, "vpc", {
            maxAzs: 2,
            natGateways: 2,
            subnetConfiguration: [
                {
                    subnetType: process.env.DEBUG
                        ? ec2.SubnetType.PUBLIC
                        : ec2.SubnetType.PRIVATE_WITH_NAT,
                    name: "private-subnet",
                    cidrMask: 24,
                },
                {
                    subnetType: ec2.SubnetType.PUBLIC,
                    name: "public-subnet",
                    cidrMask: 24,
                },
            ],
        })

        // Create bastion
        const bastionSg = new ec2.SecurityGroup(this, "bastion-sg", {
            vpc: this.vpc,
            allowAllOutbound: true,
            securityGroupName: "bastion-sg",
        });
        bastionSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));

        // Create bastion instance
        new ec2.Instance(this, "bastion", {
            vpc: this.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            machineImage: ec2.MachineImage.latestAmazonLinux({
                generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
            securityGroup: bastionSg,
            keyName: "ec2-key-pair",
            instanceName: "bastion",
        });
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
            environmentVariables: {
                DEBUG: { value: process.env.DEBUG },
                AWS_DEFAULT_REGION: { value: process.env.AWS_DEFAULT_REGION },
                CDK_DEFAULT_ACCOUNT: { value: process.env.CDK_DEFAULT_ACCOUNT },
                CDK_DEFAULT_REGION: { value: process.env.CDK_DEFAULT_REGION },
            },
        });
    }
}
