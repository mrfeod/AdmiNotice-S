var fs = require('fs');

var messages = require("./messages");
var msgStorage = new messages.messages("./base.db", function (){
	console.log('Database initialized. Server started.')
});

function get(response, query) {
	if(query.id)
		msgStorage.getMessage(query.id, function(result, msg) {
			if(result) {
				response.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
				response.write("{id:" + query.id + ", message:\"" + msg + "\"" + "}");
				response.end();
			}
			else {
				if(msg) {
					response.writeHead(404, {"Content-Type": "text/plain;charset=utf-8"});
					response.write("404 " + msg);
					response.end();
				}
				else {
					response.writeHead(500, {"Content-Type": "text/plain;charset=utf-8"});
					response.write("500 Database was fucked up");
					response.end();
				}
			}
		});
	else {
		response.writeHead(406, {"Content-Type": "text/plain;charset=utf-8"});
		response.write("406 You can't request /get without specify \"id\" parametr");
		response.end();
	}
}

function pull(response, query) {
	var id = msgStorage.getLastId() - 5;
	if(query.id)
		id = query.id;

	msgStorage.pullMessages(id, function(result, msg) {
		if(result) {
			response.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
			response.write(msg);
			response.end();
		}
		else {
			if(msg) {
				response.writeHead(404, {"Content-Type": "text/plain;charset=utf-8"});
				response.write("404 " + msg);
				response.end();
			}
			else {
				response.writeHead(500, {"Content-Type": "text/plain;charset=utf-8"});
				response.write("500 Database was fucked up");
				response.end();
			}
		}
	});
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

					response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
					response.write(html);
					response.end();
				});
			}
			else {
				response.writeHead(403, {"Content-Type": "text/html;charset=utf-8"});
				response.write("403 Forbidden");
				response.end();
			}
		});
	}
	else {
		response.writeHead(406, {"Content-Type": "text/plain;charset=utf-8"});
		response.write("406 You can't request /send without specify \"key\" parametr");
		response.end();
	}
}

function save(response, query) {
	if(query.msg)
		msgStorage.saveMessage(query.msg, function(result, id) {
			fs.readFile("./save.html", function(err, html){
				if(err)
					throw err;

				var message = "Message successfully saved";
				if(result) {
					response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
					if(id)
						message = "Message " + id + ": \"" + query.msg + "\" - successfully saved"; 
				}
				else {
					response.writeHead(500, {"Content-Type": "text/html;charset=utf-8"});
					message = "500 Database was fucked up";
				}

				var page = html.toString().replace('___server_message___', message);
				response.write(page);
				response.end();
			});
		});
	else {
		response.writeHead(406, {"Content-Type": "text/plain;charset=utf-8"});
		response.write("406 You can't request /save without specify \"msg\" parametr");
		response.end();
	}
}

exports.get = get;
exports.pull = pull;
exports.send = send;
exports.save = save;
