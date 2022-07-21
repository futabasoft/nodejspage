'use strict';
const http = require('http');
const express = require('express');
const auth = require('basic-auth');
const port = process.env.PORT || 3000;
const user = process.env.HTTP_USER;
const pass = process.env.HTTP_PASS;
// Create an Express app
var app = express();



var authfunc = (req, res, next) => {
    const credentials = auth(req);
    if (credentials) {
        const { name, pass } = credentials

        if (name ===user && pass === pass) {
            next();
            return;
        }
    }

    res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="realm"',
        'Content-Length': '0',
    })
    res.end();
};
app.use('/',authfunc);
app.use("/", express.static("public"));
var server = http.createServer(app);


/*http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);*/
console.log(process.env);
console.log("port=" + port);
console.log("user=" + user);
console.log("pass=" + pass);
server.listen(port);
