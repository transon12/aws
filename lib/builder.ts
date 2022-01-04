import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import { Vpc, SubnetType, SecurityGroup, InstanceType, Peer, Port, InstanceSize, InstanceClass, Instance, MachineImage, AmazonLinuxGeneration } from '@aws-cdk/aws-ec2';
import { LinuxBuildImage, ComputeType, Project, BuildSpec } from '@aws-cdk/aws-codebuild';
export class builderStack extends cdk.Stack {
    public vpc: ec2.Vpc;
    public bastionSg: ec2.SecurityGroup;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.vpc = new Vpc(this, "vpc", {
            maxAzs: 2,
            natGateways: 2,
            subnetConfiguration: [
                {
                    subnetType: process.env.DEBUG
                        ? SubnetType.PUBLIC
                        : SubnetType.PRIVATE_WITH_NAT,
                    name: "private-subnet-2",
                    cidrMask: 24,
                },
                {
                    subnetType: SubnetType.PUBLIC,
                    name: "public-subnet-2",
                    cidrMask: 24,
                },
            ],
        })

        // Create bastion
        const bastionSg = new SecurityGroup(this, "bastion-sg-2", {
            vpc: this.vpc,
            allowAllOutbound: true,
            securityGroupName: "bastion-sg-2",
        });
        bastionSg.addIngressRule(Peer.anyIpv4(), Port.tcp(22));

        // Create bastion instance
        new Instance(this, "bastion-2", {
            vpc: this.vpc,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            machineImage: MachineImage.latestAmazonLinux({
                generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
            securityGroup: bastionSg,
            keyName: "simple-instance-2-key",
            instanceName: "bastion-2",
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

        new Project(this, 'code-build-ver-1', {
            buildSpec: BuildSpec.fromObject({
                phases: {
                    build: {
                        commands: [
                            "npm install -g typescript",
                            "npm install -g aws-cdk",
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
            environment: {
                buildImage: LinuxBuildImage.STANDARD_5_0,
                privileged: true,
                computeType: ComputeType.SMALL,
            },
        });
    }
}
