var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String, //hash created from password
    //created_at: {type: Date, default: Date.now}
	movieProfile: {type: Schema.ObjectId, ref: 'MovieProfile'}
});

var postSchema = new Schema({
    created_by: { type: Schema.ObjectId, ref: 'User' },
    created_at: {type: Date, default: Date.now},
    text: String
}); 

var movieProfileSchema = new Schema({
	genres: [{genre: String}],
	actors: [{actor: String}],
	directors: [{director: String}],
	rating: Number,
	length: Number,
	
	prefs: [{movie: String, liked: Boolean}]
});

mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);
mongoose.model('MovieProfile', movieProfileSchema);