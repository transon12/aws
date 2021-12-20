#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ec2Stack } from '../lib/ec2Stack';
import { builderStack } from '../lib/builder'

const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
}
const app = new cdk.App();
const builder = new builderStack(app, 'builderStack', { env });
new ec2Stack(app, 'ec2Stack', { vpc: builder.vpc });
