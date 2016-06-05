var server = require("./lib/server");
var router = require("./lib/router");
var requestHandlers = require("./lib/requestHandlers");

var handle = {}
handle["/"] = requestHandlers.pull;
handle["/get"] = requestHandlers.get;
handle["/pull"] = requestHandlers.pull;
handle["/send"] = requestHandlers.send;
handle["/save"] = requestHandlers.save;

server.start(router.route, handle);
