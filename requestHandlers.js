var fs = require('fs');

var messages = require("./messages");
var msgStorage = new messages.messages("./base.db", function (){
	console.log('Database initialized. Server started.')
});

function save(response, query) {
	if(query.msg)
		msgStorage.saveMessage(query.msg, function(result, id) {
			fs.readFile("./save.html", function(err, html){
				if(err)
					throw err;

				var message = "Message successfully saved";
				if(result) {
					response.writeHead(200, {"Content-Type": "text/html"});
					if(id)
						message = "Message " + id + ": \"" + query.msg + "\" - successfully saved"; 
				}
				else {
					response.writeHead(500, {"Content-Type": "text/html"});
					message = "500 Database was fucked up";
				}

				var page = html.toString().replace('___server_message___', message);
				response.write(page);
				response.end();
			});
		});
	else {
		response.writeHead(406, {"Content-Type": "text/plain"});
		response.write("406 You can't request /save without specify \"msg\" parametr");
		response.end();
	}
}

function get(response, query) {
	if(query.id)
		msgStorage.getMessage(query.id, function(result, msg) {
			if(result) {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write("{id:" + query.id + ", message:\"" + msg + "\"" + "}");
				response.end();
			}
			else {
				if(msg) {
					response.writeHead(404, {"Content-Type": "text/plain"});
					response.write("404 " + msg);
					response.end();
				}
				else {
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write("500 Database was fucked up");
					response.end();
				}
			}
		});
	else {
		response.writeHead(406, {"Content-Type": "text/plain"});
		response.write("406 You can't request /get without specify \"id\" parametr");
		response.end();
	}
}

function send(response, query) {
	if(query.key) {
		fs.readFile("./key", function(err, key){
			if(err)
				throw err;

			if(key.toString() === query.key.toString()) {
				fs.readFile("./send.html", function(err, html){
					if(err)
						throw err;

					response.writeHead(200, {"Content-Type": "text/html"});
					response.write(html);
					response.end();
				});
			}
			else {
				response.writeHead(403, {"Content-Type": "text/html"});
				response.write("403 Forbidden");
				response.end();
			}
		});
	}
	else {
		response.writeHead(406, {"Content-Type": "text/plain"});
		response.write("406 You can't request /send without specify \"key\" parametr");
		response.end();
	}
}

exports.save = save;
exports.get = get;
exports.send = send;