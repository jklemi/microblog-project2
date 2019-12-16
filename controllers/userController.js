var User = require('../models/user');
var Post = require('../models/post');
const validator = require('express-validator');
var bcrypt = require('bcrypt');
var async = require('async');
var passport = require('passport');

const saltRounds = 10;

// Home page
exports.index = function(req, res) {
	async.parallel({
		user_count: function(callback) {
			User.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
		},
		post_count: function(callback) {
			Post.countDocuments({}, callback);
		}
	}, function(err, results) {
		res.render('index', { title: 'Microblog Home', error: err, data: results, loggedUser: req.user });
	});
};

// Display Login form on GET.
exports.user_login_get = function(req, res) {
    if (req.user) {
        res.render('unauthorized', {loggedUser: req.user});
    } else {
        res.render('login_form', { title: 'Log in', loggedUser: req.user });
    }
};

// Handle Login form on POST.
exports.user_login_post = function(req, res, next) {
    const handler = passport.authenticate('local', { 
      successRedirect: '/home',
      failureRedirect: '/home/login',
      failureFlash: true 
    });
    handler(req, res, next);
};

// Logout GET
exports.user_logout_get = function(req, res) {
    res.render('logout', { title: 'Do you wish to log out?', loggedUser: req.user});
};

// Logout POST
exports.user_logout_post = function(req, res, next) {
    if (req.user) {
      req.logout();
    }
    res.redirect('/home');
};

// Display list of all Users.
exports.user_list = function(req, res, next) {
  
  User.find({}, 'username password')
    .exec(function (err, list_users) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('user_list', { title: 'User List', user_list: list_users, loggedUser: req.user });
    });

};

// Display detail page for a specific User.
exports.user_detail = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id)
              .exec(callback)
        },
        users_posts: function(callback) {
            Post.find({ 'creator': req.params.id })
              .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.user==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('user_detail', { title: 'User Detail', pageUser: results.user, users_posts: results.users_posts, loggedUser: req.user });
    });
};

// Display Register form on GET.
exports.user_register_get = function(req, res) {
    if (req.user) {
        res.render('unauthorized', {loggedUser: req.user});
    } else {
        res.render('register_form', { title: 'Register New User', loggedUser: req.user });
    }
};

// Handle Register on POST.
exports.user_register_post = [
   
  // Validate username and password fields.
  validator.body('username').isLength({ min: 3, max: 50 }).trim().withMessage('Username must be in range 3-50').isAlphanumeric().withMessage('Username must contain only letters and numbers'),
  validator.body('password').isLength({ min: 3, max: 50 }).trim().withMessage('Password must be in range 3-50').isAlphanumeric().withMessage('Password must contain only letters and numbers'),
  
  // Sanitize (escape) the name field.
  validator.sanitizeBody('username').escape(),
  validator.sanitizeBody('password').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    var user = new User;
    // Hash and salt password before storing
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      // Create a user object with escaped and trimmed data. 
      user.username = req.body.username;
      user.password = hash;
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with error messages.
      res.render('register_form', { title: 'Register New User', user: user, errors: errors.array(), loggedUser: req.user});
      return;
    }
    else {
      // Data from form is valid.
      // Check if User with same name already exists.
      User.findOne({ 'username': req.body.username }).exec( function(err, found_user) {
        if (err) { return next(err); }
        if (found_user) {
          // User exists, redirect to same page.
          //res.send('User already exists.');
          res.redirect('/');
        }
        else {
          user.save(function (err) {
            if (err) { return next(err); }
            // User saved. Redirect to home page.
            //res.send('User saved.');
            res.redirect('/home');
          });
        }
      });
    }
  }
];


// Display User delete form on GET.
exports.user_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle User delete on POST.
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

// Display User update form on GET.
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};
