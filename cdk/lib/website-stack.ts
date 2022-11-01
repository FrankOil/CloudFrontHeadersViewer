import { Stack, StackProps } from "aws-cdk-lib";
import { Distribution, HttpVersion, SecurityPolicyProtocol, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class WebsiteStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const frontendBucket = new Bucket(this, "FrontendBucket", {
			encryption: BucketEncryption.S3_MANAGED, // Required by OAI (Origin Access Identity).
			enforceSSL: true,
			objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
		});

		new Distribution(this, "Distribution", {
			defaultBehavior: {
				origin: new S3Origin(frontendBucket),
				viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY
			},
			defaultRootObject: "index.html",
			httpVersion: HttpVersion.HTTP2_AND_3,
			minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
		});
	}
}
