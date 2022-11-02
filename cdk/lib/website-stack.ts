import { Stack, StackProps } from "aws-cdk-lib";
import {
	CachePolicy,
	Distribution, Function, FunctionCode, HttpVersion,
	OriginRequestHeaderBehavior,
	OriginRequestPolicy,
	SecurityPolicyProtocol,
	ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import * as path from "path";

export class WebsiteStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const frontendBucket = new Bucket(this, "FrontendBucket", {
			encryption: BucketEncryption.S3_MANAGED, // Required by OAI (Origin Access Identity).
			enforceSSL: true,
			objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
		});

		const responseFunction = new Function(this, "ResponseFunction", {
			code: FunctionCode.fromFile({
				filePath: path.join(__dirname, "../functions/response.js"),
			}),
		});

		const distributionOriginRequestPolicy = new OriginRequestPolicy(this, "DistributionOriginRequestPolicy", {
			headerBehavior: OriginRequestHeaderBehavior.allowList(
				"cloudfront-viewer-address",
				"cloudfront-viewer-country",
				"cloudfront-viewer-country-region-name",
				"cloudfront-viewer-city",
				"cloudfront-viewer-latitude",
				"cloudfront-viewer-longitude",
				"cloudfront-viewer-postal-code",
				"cloudfront-viewer-time-zone",
			),
		});

		new Distribution(this, "Distribution", {
			defaultBehavior: {
				origin: new S3Origin(frontendBucket),
				viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
				cachePolicy: CachePolicy.CACHING_DISABLED,
				originRequestPolicy: distributionOriginRequestPolicy,
			},
			defaultRootObject: "index.html",
			httpVersion: HttpVersion.HTTP2_AND_3,
			minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
		});
	}
}
