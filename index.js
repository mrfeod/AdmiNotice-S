var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.pull;
handle["/get"] = requestHandlers.get;
handle["/pull"] = requestHandlers.pull;
handle["/send"] = requestHandlers.send;
handle["/save"] = requestHandlers.save;

server.start(router.route, handle);
