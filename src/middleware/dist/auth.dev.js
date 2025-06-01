"use strict";

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _User = _interopRequireDefault(require("../model/User.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var protectedRoute = function protectedRoute(req, res, next) {
  return regeneratorRuntime.async(function protectedRoute$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {} catch (error) {}

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};