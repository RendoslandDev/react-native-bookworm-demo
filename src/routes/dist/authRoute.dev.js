"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _User = _interopRequireDefault(require("../models/User.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var generateToken = function generateToken(userId) {
  // Implement your token generation logic here
  // For example, using JWT:
  return jwt.sign({
    id: userId
  }, process.env.JWT_SECRET, {
    expiresIn: '15d'
  }); // Placeholder for demonstration
};

router.get('/register', function _callee(req, res) {
  var _req$query, email, username, password, existingEmail, existingUsername, profileImage, newUser, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$query = req.query, email = _req$query.email, username = _req$query.username, password = _req$query.password;

          if (!(!username || !email || !password)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Username and password are required'
          }));

        case 4:
          if (!(password.length < 6)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Password must be at least 6 characters long'
          }));

        case 6:
          if (email.includes('@')) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Invalid email address'
          }));

        case 8:
          if (!(username.length < 3)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Username must be at least 3 characters long'
          }));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            email: email
          }));

        case 12:
          existingEmail = _context.sent;

          if (!existingEmail) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Email already registered'
          }));

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            username: username
          }));

        case 17:
          existingUsername = _context.sent;

          if (!existingUsername) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Username already taken'
          }));

        case 20:
          profileImage = "https://api.dicebear.com/7.x/avataars/svg?seed=".concat(username); // Default profile image URL

          newUser = new _User["default"]({
            username: username,
            email: email,
            password: password,
            profileImage: profileImage
          });
          _context.next = 24;
          return regeneratorRuntime.awrap(newUser.save());

        case 24:
          res.status(201).json({
            message: 'User registered successfully'
          });
          token = generateToken(newUser._id);
          res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profileImage: newUser.profileImage,
            token: token
          });
          _context.next = 33;
          break;

        case 29:
          _context.prev = 29;
          _context.t0 = _context["catch"](0);
          console.error('Error registering user:', _context.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 29]]);
});
router.get('/login', function _callee2(req, res) {
  var _req$body, email, password, user, isPasswordValid, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, email = _req$body.email, password = _req$body.password;

          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Email and password are required'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            email: email
          }));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            message: 'Invalid email or password'
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(user.comparePassword(password));

        case 11:
          isPasswordValid = _context2.sent;

          if (isPasswordValid) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            message: 'Invalid email or password'
          }));

        case 14:
          token = generateToken(user._id);
          res.status(200).json({
            token: token,
            user: {
              _id: user._id,
              username: user.username,
              email: user.email,
              profileImage: user.profileImage
            }
          });
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.error('Error logging in:', _context2.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
var _default = router;
exports["default"] = _default;