var Datastore = require('nedb');

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
			console.log('Message storage init failed: ' + err);
			return;
		}
		lastId.set(count);
		console.log('Last message id = ' + lastId.get() +'.');
		startCallback();
	});

	return {
		saveMessage: function (text, callback) {
			var currentTime = new Date();
			var msg = {
				message: text,
				date: currentTime.toISOString(),
				_id: 1+lastId.inc()
			};

			db.insert(msg, function (err, newDoc) {
				if(err) {
					console.log('Adding Message ' + err);
					callback(false);
				}
				else {
					console.log('Add message #' + newDoc._id + ': \"' + newDoc.message + '\"');
					callback(true, newDoc._id);
				}
			});
		},
		getMessage: function (id, callback) {
			db.findOne({ _id: parseInt(id) }, function (err, docs) {
				if(err) {
					console.log('Getting Message ' + err);
					callback(false);
				}
				if(docs) {
					console.log('Get message #' + docs._id + ': \"' + docs.message + '\"');
					callback(true, docs.message);
				}
				else {
					callback(false , "Message " + id + " not found");
				}
			});
		},
		pullMessages: function (id, callback) {
			var oneWeekAgo = new Date();
			oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
			db.find({ _id: { $gt: parseInt(id) }, date: { $gte: oneWeekAgo.toISOString() } }, function (err, docs) {
				if(err) {
					console.log('Pulling Message ' + err);
					callback(false);
				}
				if(docs.length > 0) {
					var pull = [];
					if(docs.length > 5) {
						for (var i = 0; i < 5; i++)
							pull.push(docs.pop());
					}
					else pull = docs;

					callback(true, "response: " + JSON.stringify(pull));
				}
				else {
					callback(false , "Nothing to pull for id " + id);
				}
			});
		},
		getLastId: function () { return lastId.get(); }
	}
}
