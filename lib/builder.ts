import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import * as codebuild from '@aws-cdk/aws-codebuild';

export class builder extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        new codebuild.Project(this, 'MyProject', {
            source: codebuild.Source.bitBucket({
                owner: 'awslabs',
                repo: 'aws-cdk',
            }),
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    build: {
                        commands: [
                            "git clone https://github.com/transon12/aws.git",
                            "npm install",
                            "cdk deploy VpcCreateNewStack",
                            "export EC2_INSTANCE_ID=$(ec2metadata --instance-id)",
                            "echo EC2_INSTANCE_ID"
                        ],
                    },
                },
            }),
        });
    }
}
