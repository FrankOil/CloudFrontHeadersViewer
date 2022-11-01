import { Stack, StackProps } from "aws-cdk-lib";
import { Bucket, BucketEncryption, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class WebsiteStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const frontendBucket = new Bucket(this, 'FrontendBucket', {
			encryption: BucketEncryption.S3_MANAGED, // Required by OAI (Origin Access Identity).
			enforceSSL: true,
			objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
		});
	}
}
