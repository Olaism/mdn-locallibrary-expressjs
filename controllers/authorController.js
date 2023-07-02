const Author = require("../models/author");
const asyncHandler = require("express-async-handler");

// Display lists of all authors
exports.author_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMETED: Author List");
});

// Display detail page for a specific author
exports.author_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMETED: Author Detail ${req.params.id}`);
});

// Display author create form on get
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create get");
});

// Display author create form on post
exports.author_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create post");
});

// Display author update form on get
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete get");
});

// Display author update form on post
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete post");
});

// Display author update form on get
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update get");
});

// Display author update form on post
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update post");
});
