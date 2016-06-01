var server = require("./server");
var router = require("./router");
var messages = require("./messages");

//server.start(router.route);
//var db_path = "./base.db";
//var Datastore = require('nedb')
//  , db = new Datastore({ filename: db_path, autoload: true });
//
//db.find({ id: 0 }, function (err, docs) {
//  console.log(docs[0].message);
//});
//
var msgStorage = new messages.messages("./base.db", function (){
	msgStorage.saveMessage("Hello World");
	msgStorage.saveMessage("I did this yahooo");
});



