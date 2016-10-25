

var mongoose = require('mongoose');
var User = mongoose.model('User');
var MovieProfile = mongoose.model('MovieProfile');
var express = require('express');
var router = express.Router();
var Post = mongoose.model('Post');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if(req.method === "GET"){
        return next();
    }
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

router.route('/preferences/movies')
	.post(function(req, res) {
		User.findById(req.body._id)
		.populate('movieProfile')
		.exec(function(err, user){
			if(err) res.send(504, err);
			return res.send(user.movieProfile.prefs);
		});
	})
	
	.put(function(req, res){
		if(req.body.movieTitle === null)
			return res.send(506, 'nothing to set');
		User.findById(req.body._id)
		.populate('movieProfile')
		.exec(function(err,user){
			if(err) {
				return res.send(505, err);
			}
			var prefItem = {movie: req.body.movieTitle, liked: req.body.liked}
			user.movieProfile.prefs.push(prefItem);
			user.movieProfile.save(function(err){
				if(err) return res.send(506, err);
			});
			return res.send(user);
		});
	})
	
	.delete(function(req, res) {
		User.findById(req.body._id)
		.populate('movieProfile')
		.exec(function(err, user){
			if(err) return res.send(507, err);
			
			// remove all movies with movieTitle from preferences
			var prefsArr = user.movieProfile.prefs;
			for(var i = user.movieProfile.prefs.length-1; i>=0; i--)
				if(prefsArr[i].movie === req.body.movieTitle)
					prefsArr.splice(i, 1);
			
			user.movieProfile.save(function(err){
				if(err)return res.send(508,err);
				return res.send(user.movieProfile.prefs);
			});
		});
	});


//Register the authentication middleware
//router.use('/posts', isAuthenticated);

module.exports = router;