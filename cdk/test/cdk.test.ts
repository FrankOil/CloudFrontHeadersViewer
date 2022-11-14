import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { WebsiteStack } from '../lib/website-stack';

test('WebsiteStack Created', () => {
	const app = new App();

	const stack = new WebsiteStack(app, 'MyTestStack');

	const template = Template.fromStack(stack);

	template.hasResourceProperties('AWS::S3::Bucket', {
		BucketEncryption: {
			ServerSideEncryptionConfiguration: [
				{
					ServerSideEncryptionByDefault: {
						SSEAlgorithm: 'AES256',
					},
				},
			],
		},
		OwnershipControls: {
			Rules: [
				Match.objectLike({
					ObjectOwnership: 'BucketOwnerEnforced',
				}),
			],
		},
		PublicAccessBlockConfiguration: {
			BlockPublicAcls: true,
			BlockPublicPolicy: true,
			IgnorePublicAcls: true,
			RestrictPublicBuckets: true,
		},
	});

	template.hasResourceProperties('AWS::S3::BucketPolicy', {
		PolicyDocument: {
			Statement: [
				Match.objectLike({
					Action: 's3:*',
					Condition: {
						Bool: {
							'aws:SecureTransport': 'false',
						},
					},
					Effect: 'Deny',
					Principal: {
						AWS: '*',
					},
				}),
			],
		},
	});
});
