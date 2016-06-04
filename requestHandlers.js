var messages = require("./messages");
var msgStorage = new messages.messages("./base.db", function (){
	console.log('Database has initialized')
});

function save(response, query) {
	if(query.msg)
		msgStorage.saveMessage(query.msg, function(result, id) {
			if(result) {
				response.writeHead(200, {"Content-Type": "text/plain"});
				if(id)
					response.write("Message " + id + ": \"" + query.msg + "\" - successfully saved");
				else
					response.write("Message successfully saved");
				response.end();
			}
			else {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write("500 Database was fucked up");
				response.end();
			}
		});
	else {
		response.writeHead(400, {"Content-Type": "text/plain"});
		response.write("400 You can't request /save without specify \"msg\" parametr");
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
		response.writeHead(400, {"Content-Type": "text/plain"});
		response.write("400 You can't request /get without specify \"id\" parametr");
		response.end();
	}
}

function send(response, query) {
	console.log("Request handler 'send' was called.");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello /send");
	response.end();
}

exports.save = save;
exports.get = get;
exports.send = send;