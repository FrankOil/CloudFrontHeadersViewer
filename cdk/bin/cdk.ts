#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { WebsiteStack } from '../lib/website-stack';

const app = new App();

new WebsiteStack(app, 'WebsiteStack', {
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
