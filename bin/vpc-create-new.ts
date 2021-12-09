#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcCreateNewStack } from '../lib/vpc-create-new-stack';
import { builder } from '../lib/builder'

const app = new cdk.App();
new VpcCreateNewStack(app, 'VpcCreateNewStack');
new builder(app, 'builder');
