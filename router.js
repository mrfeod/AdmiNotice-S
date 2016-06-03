var messages = require("./messages");
var msgStorage = new messages.messages("./base.db", function (){
	console.log('Database has initialized')
});

function route(pathname, query) {
	if(pathname === "/send")
	{
		if(query.msg)
			msgStorage.saveMessage(query.msg);
	}
	else if(pathname === "/get")
	{
		if(query.id)
			msgStorage.getMessage(query.id);
	}
		console.log("About to route a request for " + pathname);
}

exports.route = route;