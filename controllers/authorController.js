const debug = require("debug")("author");
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display lists of all authors
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
  return res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
  });
});

// Display detail page for a specific author
exports.author_detail = asyncHandler(async (req, res, next) => {
  // check if the id is a valid id
  if (!mongoose.isValidObjectId(req.params.id)) {
    debug(`Invalid ObjectID on detail_get - ${req.params.id}`);
    const err = new Error("Invalid ID");
    err.status = 404;
    return next(err);
  }

  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results
    debug(`id not found on detail - ${req.params.id}`);
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor,
  });
});

// Display author create form on get
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.render("author_form", {
    title: "Create Author",
  });
});

// Display author create form on post
exports.author_create_post = [
  // Validate and sanitize fields
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    // get the validation errors
    const errors = validationResult(req);

    // Create author object with escaped and trimmed data
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid

      // Save author
      await author.save();
      // Redirect to new author record.
      res.redirect(author.url);
    }
  }),
];

// Display author update form on get
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  const { author, allBooksByAuthor } = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No result
    res.redirect("/catalog/authors");
  }

  res.render("author_delete", {
    title: "Delete author",
    author: author,
    author_books: allBooksByAuthor,
  });
});

// Display author update form on post
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  const { author, allBooksByAuthor } = await Promise.all([
    Author.findById().exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksByAuthor.length > 0) {
    res.render("author_delete", {
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
    });
    return;
  } else {
    await Author.findByIdAndRemove(req.body.authorid);
    redirect("/catalog/authors");
  }
});

// Display author update form on get
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update get");
});

// Display author update form on post
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update post");
});
