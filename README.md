# CloudFront Headers Viewer
A simple website that uses a CloudFront function to display user's CloudFront HTTP headers.

![CloudFront Functions Location](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2021/04/01/cloudfront-functions-where.png)
[Source: AWS News Blog | Introducing CloudFront Functions – Run Your Code at the Edge with Low Latency at Any Scale](https://aws.amazon.com/blogs/aws/introducing-cloudfront-functions-run-your-code-at-the-edge-with-low-latency-at-any-scale/)

To ensure lowest latency and sub-millisecond execution time, we want to use CloudFront Functions rather than CloudFront Lambda@Edge (CloudFront Functions are executed closest to the user at [CloudFront Edge Locations](https://aws.amazon.com/cloudfront/features)).

Our function will be triggered by a [viewer request event](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-event-structure.html#functions-event-structure-request) to collect [CloudFront HTTP headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-cloudfront-headers.html) and redirect the user to display them in the frontend client.
