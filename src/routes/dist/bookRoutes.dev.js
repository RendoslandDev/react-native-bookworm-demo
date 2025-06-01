"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cloudinary = _interopRequireDefault(require("../lib/cloudinary.js"));

var _auth = _interopRequireDefault(require("../middleware/auth.js"));

var _book = _interopRequireDefault(require("../models/book.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

// Assuming you have a Book model defined
router.post('/', _auth["default"], function _callee(req, res) {
  var _req$body, title, caption, image, rating, user, uploadResponse, imageUrl, imagePublicId, newBook;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, title = _req$body.title, caption = _req$body.caption, image = _req$body.image, rating = _req$body.rating, user = _req$body.user;

          if (!(!title || !caption || !image || !rating || !user)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'All fields are required'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(_cloudinary["default"].uploader.upload(image, {
            folder: 'book_images',
            allowed_formats: ['jpg', 'png', 'jpeg']
          }));

        case 6:
          uploadResponse = _context.sent;
          imageUrl = uploadResponse.secure_url;
          imagePublicId = uploadResponse.public_id;
          newBook = new _book["default"]({
            title: title,
            caption: caption,
            image: imageUrl,
            rating: rating,
            user: req.user._id
          });
          _context.next = 12;
          return regeneratorRuntime.awrap(newBook.save());

        case 12:
          res.status(201).json({
            message: 'Book created successfully',
            book: newBook
          });
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.log("Error creating book ", _context.t0);
          res.status({
            message: _context.t0.message
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
}); // const response =  await fetch("http://localhost:3002/api/books?page=3&limit=5");

router.get('/:id', _auth["default"], function _callee2(req, res) {
  var page, limit, books;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          page = req.query.page || 1;
          limit = req.query.limit || 5;
          _context2.next = 5;
          return regeneratorRuntime.awrap(_book["default"].find().sort({
            createdAt: -1
          }).skip(skip).limit(limit).populate('user', 'username profileImage').exec());

        case 5:
          books = _context2.sent;
          _context2.t0 = res;
          _context2.t1 = books;
          _context2.t2 = page;
          _context2.t3 = Math;
          _context2.next = 12;
          return regeneratorRuntime.awrap(_book["default"].countDocuments());

        case 12:
          _context2.t4 = _context2.sent;
          _context2.t5 = limit;
          _context2.t6 = _context2.t4 / _context2.t5;
          _context2.t7 = _context2.t3.ceil.call(_context2.t3, _context2.t6);
          _context2.next = 18;
          return regeneratorRuntime.awrap(_book["default"].countDocuments());

        case 18:
          _context2.t8 = _context2.sent;
          _context2.t9 = {
            books: _context2.t1,
            currentPage: _context2.t2,
            totalPages: _context2.t7,
            totalBooks: _context2.t8
          };

          _context2.t0.send.call(_context2.t0, _context2.t9);

          _context2.next = 27;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t10 = _context2["catch"](0);
          console.error('Error fetching book:', _context2.t10);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
router.get('/user', _auth["default"], function _callee3(req, res) {
  var userId, books;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.user._id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_book["default"].find({
            user: userId
          }).sort({
            createdAt: -1
          }).populate('user', 'username profileImage').exec());

        case 4:
          books = _context3.sent;
          res.status(200).json(books);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error('Error fetching user books:', _context3.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
delete router["delete"]('/:id', _auth["default"], function _callee4(req, res) {
  var bookId, book, publicId;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          bookId = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_book["default"].findById(bookId));

        case 4:
          book = _context4.sent;

          if (book) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Book not found'
          }));

        case 7:
          if (!(book.user.toString() !== req.user._id.toString())) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            message: 'You are not authorized to delete this book'
          }));

        case 9:
          if (!(book.image && book.image.includes('cloudinary'))) {
            _context4.next = 20;
            break;
          }

          _context4.prev = 10;
          publicId = book.image.split('/').pop().split('.')[0];
          _context4.next = 14;
          return regeneratorRuntime.awrap(_cloudinary["default"].uploader.destroy(publicId));

        case 14:
          _context4.next = 20;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](10);
          console.error('Error deleting image from Cloudinary:', _context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            message: 'Failed to delete image from Cloudinary'
          }));

        case 20:
          _context4.next = 22;
          return regeneratorRuntime.awrap(_book["default"].findByIdAndDelete(bookId));

        case 22:
          res.status(200).json({
            message: 'Book deleted successfully'
          });
          _context4.next = 29;
          break;

        case 25:
          _context4.prev = 25;
          _context4.t1 = _context4["catch"](0);
          console.error('Error deleting book:', _context4.t1);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 25], [10, 16]]);
});
var _default = router;
exports["default"] = _default;