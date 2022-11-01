import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { WebsiteStack } from "../lib/website-stack";

test("WebsiteStack Created", () => {
	const app = new App();

	const stack = new WebsiteStack(app, "MyTestStack");

	const template = Template.fromStack(stack);

	template.hasResourceProperties("AWS::S3::Bucket", {
		BucketEncryption: {
			ServerSideEncryptionConfiguration: [
				{
					ServerSideEncryptionByDefault: {
						SSEAlgorithm: "AES256",
					},
				},
			],
		},
	});

	template.hasResourceProperties("AWS::S3::BucketPolicy", {
		PolicyDocument: {
			Statement: [
				{
					Condition: {
						Bool: {
							"aws:SecureTransport": "false"
						}
					}
				},
			]
		},
	});
});
