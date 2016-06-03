var Datastore = require('nedb');
var util = require('util');
exports.messages = function messages(storage, startCallback)
{
	var db = new Datastore({ filename: storage, autoload: true });
	function LastIdClosure() {
		var id = -1;
		return {
			get: function() { return id  ; },
			inc: function() { return id++; },
			set: function(_id) { id = _id; },
		}
	}
	var lastId = LastIdClosure();

	db.count({}, function (err, count) {
		if(err) {
			console.log('Message module init failed: ' + err);
			return;
		}
		lastId.set(count);
		console.log('Message module inited. Last message id = ' + lastId.get() +'.');
		startCallback();
	});

	return {
		saveMessage: function (text) {
			var currentTime = new Date();
			var msg = {
				message: text,
				date: currentTime.toISOString(),
				_id: 1+lastId.inc()
			};

			db.insert(msg, function (err, newDoc) {
				if(err) {
					console.log('Adding Message ' + err);
					return;
				}
				console.log('Add message #' + newDoc._id + ': \"' + newDoc.message + '\"');
			});
		},
		getMessage: function (id) {
			db.findOne({ _id: parseInt(id) }, function (err, docs) {
				if(err) {
					console.log('Getting Message ' + err);
					return;
				}
				if(docs) {
					console.log('Get message #' + docs._id + ': \"' + docs.message + '\"');
				}
			});
		}
	}
}