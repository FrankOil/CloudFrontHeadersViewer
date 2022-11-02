var querystring = require("querystring");

function handler(event: { request: any; }) {
	var request = event.request;

	try {
		var requestURI = request.uri;

		if (requestURI === "/favicon.svg" || requestURI.startsWith("/assets")) {
			return request;
		}

		var requestHeaders = request.headers;

		var requestURL = `https://${requestHeaders["host"].value}`;

		var viewerAddress = requestHeaders["cloudfront-viewer-address"]
			? requestHeaders["cloudfront-viewer-address"].value
			: "";

		var viewerCountry = requestHeaders["cloudfront-viewer-country"]
			? requestHeaders["cloudfront-viewer-country"].value
			: "";

		var viewerRegion = requestHeaders["cloudfront-viewer-country-region-name"]
			? requestHeaders["cloudfront-viewer-country-region-name"].value
			: "";

		var viewerCity = requestHeaders["cloudfront-viewer-city"] ? requestHeaders["cloudfront-viewer-city"].value : "";

		var viewerLatitude = requestHeaders["cloudfront-viewer-latitude"]
			? requestHeaders["cloudfront-viewer-latitude"].value
			: "";

		var viewerLongitude = requestHeaders["cloudfront-viewer-longitude"]
			? requestHeaders["cloudfront-viewer-longitude"].value
			: "";

		var viewerPostalCode = requestHeaders["cloudfront-viewer-postal-code"]
			? requestHeaders["cloudfront-viewer-postal-code"].value
			: "";

		var viewerTimeZone = requestHeaders["cloudfront-viewer-time-zone"]
			? requestHeaders["cloudfront-viewer-time-zone"].value
			: "";

		if (requestURI !== "/" && requestURI !== "/index.html") {
			var newQueryString = querystring.stringify({
				ip_address: viewerAddress,
				country: viewerCountry,
				region: viewerRegion,
				city: viewerCity,
				latitude: viewerLatitude,
				longitude: viewerLongitude,
				postal_code: viewerPostalCode,
				time_zone: viewerTimeZone,
			});

			return {
				statusCode: 302,
				statusDescription: "Found",
				headers: {
					location: { value: `${requestURL}/?${newQueryString}` },
				},
			};
		}

		return request;
	} catch (error) {
		console.log(error);

		return request;
	}
}
