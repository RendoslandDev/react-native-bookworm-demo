"use strict";

var _express = _interopRequireDefault(require("express"));

require("dotenv/config");

var _authRoute = _interopRequireDefault(require("./routes/authRoute.js"));

var _db = require("./lib/db.js");

var _cors = _interopRequireDefault(require("cors"));

var _bookRoutes = _interopRequireDefault(require("./routes/bookRoutes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = process.env.PORT || 3002;
app.use("/api/auth", _authRoute["default"]);
app.use("/api/books", _bookRoutes["default"]);
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
  (0, _db.connectDB)();
});
app.use((0, _cors["default"])());