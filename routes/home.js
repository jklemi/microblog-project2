var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');
var post_controller = require('../controllers/postController');

/// USER ROUTES ///

// GET home page.
router.get('/', user_controller.index);

router.get('/login', user_controller.user_login_get);

router.post('/login', user_controller.user_login_post);

router.get('/register', user_controller.user_register_get);

router.post('/register', user_controller.user_register_post);

// GET request to delete User.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete User.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update User.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one User.
router.get('/user/:id', user_controller.user_detail);

// GET request for list of all User items.
router.get('/users', user_controller.user_list);

/// POST ROUTES ///

// GET request for creating Post. NOTE This must come before route for id (i.e. display post).
router.get('/post/create', post_controller.post_create_get);

// POST request for creating Post.
router.post('/post/create', post_controller.post_create_post);

// GET request to delete Post.
router.get('/post/:id/delete', post_controller.post_delete_get);

// POST request to delete Post.
router.post('/post/:id/delete', post_controller.post_delete_post);

// GET request to update Post.
router.get('/post/:id/update', post_controller.post_update_get);

// POST request to update Post.
router.post('/post/:id/update', post_controller.post_update_post);

// GET request for one Post.
router.get('/post/:id', post_controller.post_detail);

// GET request for list of all Posts.
router.get('/posts', post_controller.post_list);

module.exports = router;
