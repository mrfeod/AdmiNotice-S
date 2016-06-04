var http = require("http");
var url = require("url");

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		var query = url.parse(request.url, true).query;

		if (pathname === '/favicon.ico') {
			response.writeHead(200, {'Content-Type': 'image/x-icon'} );
			response.end();
			return;
		}

		console.log("Request for " + pathname + " received.");
		route(handle, pathname, query, response);
	}

	http.createServer(onRequest).listen(8000);
	console.log("Starting the server...");
}

exports.start = start;
