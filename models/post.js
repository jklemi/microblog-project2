var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
	{
		creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
		content: {type: String, required: true, min: 3, max: 200},
		time_created: {type: Date, default: Date.now},
		time_edited: {type: Date}
	}
);

// Virtual for post's URL
PostSchema
.virtual('url')
.get(function () {
  return '/home/post/' + this._id;
});

// Virtual for formatted creation time
PostSchema
.virtual('time_created_formatted')
.get(function () {
  return moment(this.time_created).format('dddd, MMMM Do, h:mm a');
});

module.exports = mongoose.model('Post', PostSchema);
