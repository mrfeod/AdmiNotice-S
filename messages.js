var Datastore = require('nedb');
//Охуел от этих ваших замыканий, пока ничерта не понятно
exports.messages = function messages(storage, startCallback)
{
	var db = new Datastore({ filename: storage, autoload: true });
	function LastIdClosure() {
		var id = -1;
		return {
			get: function() { return id  ; },
			inc: function() { return id++; },
			set: function(_id) { id = _id; console.log('Id: ' + id); },
		}
	}
	var lastId = LastIdClosure();

	db.count({}, function (err, count) { lastId.set(count); startCallback(); });

	return {
		saveMessage: function (text) {
			var currentTime = new Date();
			var msg = {
				message: text,
				date: currentTime.toISOString(),
				_id: lastId.inc()
			};

			db.insert(msg, function (err, newDoc) {
				if(err) {
					console.log('Adding Message ' + err);
					return;
				}
				console.log('Add message #' + newDoc._id + ': \"' + newDoc.message + '\"');
			});
		}
	}
}