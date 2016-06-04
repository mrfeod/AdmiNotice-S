var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.get;
handle["/save"] = requestHandlers.save;
handle["/get"] = requestHandlers.get;
handle["/send"] = requestHandlers.send;

server.start(router.route, handle);
