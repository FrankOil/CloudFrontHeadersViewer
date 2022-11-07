#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import "source-map-support/register";
import { WebsiteStack } from "../lib/website-stack";

declare global {
	namespace NodeJS {
		export interface ProcessEnv {
			CDK_DEFAULT_ACCOUNT: string;
			CDK_DEFAULT_REGION: string;
		}
	}
}

const app = new App();

new WebsiteStack(app, "WebsiteStack", {
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
