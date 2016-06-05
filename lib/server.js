var http = require("http");
var url = require("url");
var fs = require('fs');

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		var query = url.parse(request.url, true).query;
		if (pathname === '/favicon.ico') {
			fs.readFile('./src/favicon.ico', function(err, img) {
				response.writeHead(200, {'Content-Type': 'image/x-icon'} );
				if(err) response.end();
				else    response.end(img,'binary');
			});
		}
		else {
			console.log("Request for " + request.url + " received from " + request.connection.remoteAddress.replace(/^.*:/, ''));
			route(handle, pathname, query, response);
		}
	}

	fs.readFile('./cfg/port', function(err, input) {
		var port = parseInt(input);
		if(err) {
			port = 8000;
			console.log("Reading Port " + err);
			console.log("Using default " + port);
		}
		http.createServer(onRequest).listen(port);
		console.log("Starting the server on port " + port + "...");
	});
	
}

exports.start = start;
