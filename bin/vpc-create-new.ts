#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcCreateNewStack } from '../lib/vpc-create-new-stack';
import { builderStack } from '../lib/builder'

const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
}
const app = new cdk.App();
new VpcCreateNewStack(app, 'VpcCreateNewStack');
new builderStack(app, 'builderStack', { env });
