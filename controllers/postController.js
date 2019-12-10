var Post = require('../models/post');
var User = require('../models/user');
const validator = require('express-validator');
var async = require('async');

// Display list of all Posts.
exports.post_list = function(req, res, next) {

  Post.find({}, 'content creator time_created')
    .populate('creator')
    .exec(function (err, list_posts) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('post_list', { title: 'Post List', post_list: list_posts });
    });

};

// Display detail page for a specific Post.
exports.post_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Post detail: ' + req.params.id);
};

// Display Post create form on GET.
exports.post_create_get = function(req, res) {

    // Get all users, which we can use for marking the creator of the post.
    async.parallel({
        users: function(callback) {
            User.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('post_form', { title: 'Create New Post', users: results.users });
    });

};

// Handle Post create on POST.
exports.post_create_post = [
   
  // Validate that the username field is not two or less characters.
  validator.body('content').isLength({ min: 3, max: 200 }).trim().withMessage('Message must be in range 3-200'),
  
  // Sanitize (escape) the content field.
  validator.sanitizeBody('content').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    // Create a post object with escaped and trimmed data.
    var post = new Post(
      { 
        content: req.body.content,
        creator: req.body.creator,
        time_created: Date.now()
      }
    );


    if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all users for form.
            async.parallel({
                users: function(callback) {
                    User.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('post_form', { title: 'Create New Post', users:results.users, post: post, errors: errors.array() });
            });
            return;
    }
    else {
      // Data from form is valid.
      
      post.save(function (err) {
        if (err) { return next(err); }
        // Post saved. Redirect to post detail page.
        res.redirect(post.url);
      });
    }
  }
];

// Display Post delete form on GET.
exports.post_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Post delete GET');
};

// Handle Post delete on POST.
exports.post_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Post delete POST');
};

// Display Post update form on GET.
exports.post_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Post update GET');
};

// Handle Post update on POST.
exports.post_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Post update POST');
};
