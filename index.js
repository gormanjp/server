// Main starting point of the application
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

const router = require("./router");
const app = express();

// DB setup
mongoose.connect("mongodb://localhost/auth");

// App Setup
// app.use sends all requests through middleware (morgan and bodyParser)
// morgan is logging framework, bodyParser parses incoming requests
// we are using it to parse as though all requests are json
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
// create an http server and forward it on to our express app (app)
const server = http.createServer(app);
server.listen(port);
console.log(port);
