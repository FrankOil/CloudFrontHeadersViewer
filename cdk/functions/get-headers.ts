/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Const and let statements are not supported in CloudFront Functions JavaScript runtime.
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html

var querystring = require('querystring') as typeof import('querystring');

function arrayEquals(a: string[], b: string[]) {
	return a.length === b.length && a.every((value, index) => value === b[index]);
}

function redirect(host: string, queryParameters: Record<string, string>) {
	return {
		statusCode: 302,
		statusDescription: 'Found',
		headers: {
			location: { value: `https://${host}/?${querystring.stringify(queryParameters)}` },
		},
	};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handler(event: AWSCloudFrontFunction.Event) {
	var request = event.request;
	var requestURI = request.uri;
	var requestHeaders = request.headers;
	var requestQueryParameters = request.querystring;

	try {
		// Do not modify asset requests

		if (requestURI === '/favicon.svg' || requestURI.startsWith('/assets')) {
			return request;
		}

		// Extract the host header

		var hostHeader = requestHeaders['host']!.value;

		// Extract CloudFront HTTP headers

		var correctQueryParameters = {
			ip_address: requestHeaders['cloudfront-viewer-address']!.value,
			country: requestHeaders['cloudfront-viewer-country']!.value,
			region: requestHeaders['cloudfront-viewer-country-region-name']!.value,
			city: requestHeaders['cloudfront-viewer-city']!.value,
			latitude: requestHeaders['cloudfront-viewer-latitude']!.value,
			longitude: requestHeaders['cloudfront-viewer-longitude']!.value,
			postal_code: requestHeaders['cloudfront-viewer-postal-code']!.value,
			time_zone: requestHeaders['cloudfront-viewer-time-zone']!.value,
		};

		// Redirect users to the index.html

		if (requestURI !== '/') {
			return redirect(hostHeader, correctQueryParameters);
		}

		// Redirect if the request does not contain all the required query parameters or contains additional ones.

		var correctQueryParameterNames = Object.keys(correctQueryParameters).sort();
		var requestQueryParameterNames = Object.keys(requestQueryParameters).sort();

		if (!arrayEquals(correctQueryParameterNames, requestQueryParameterNames)) {
			return redirect(hostHeader, correctQueryParameters);
		}

		// Redirect if the request query parameters are incorrect

		var correctQueryParameterValues = correctQueryParameterNames.map(
			(name) => correctQueryParameters[name as keyof typeof correctQueryParameters],
		);
		var requestQueryParameterValues = requestQueryParameterNames.map((name) =>
			decodeURIComponent(requestQueryParameters[name]!.value),
		);

		if (!arrayEquals(correctQueryParameterValues, requestQueryParameterValues)) {
			return redirect(hostHeader, correctQueryParameters);
		}

		return request;
	} catch (error) {
		console.log(error);

		return request;
	}
}
