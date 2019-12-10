var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
	{
		username: {type: String, required: true, min: 3, max: 50},
		password: {type: String, required: true, min: 3, max: 50},
		hash: {type: String, max: 200}
	}
);

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/home/user/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
