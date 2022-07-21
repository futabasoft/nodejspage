'use strict';
const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('basic-auth');
const multer = require('multer');

const port = process.env.PORT || 3000;
const user = process.env.HTTP_USER;
const pass = process.env.HTTP_PASS;
const domain = process.env.PROJECT_DOMAIN;
//glitch PROJECT_DOMAIN
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
app.post('/upload', multer({ dest: 'public/' }).single('file'), function (req, res, next) {
	const dest = "public/"+path.basename(req.file.originalname);
    const src = req.file.path;
    fs.renameSync(src, dest);
    var url="https://"+domain+"/"+dest;
    res.send('uploaded '+url);
  });
var server = http.createServer(app);

server.listen(port);

