'use strict';
const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('basic-auth');
const multer = require('multer');
const RED = require("node-red");
const bcrypt = require('bcrypt');

const port = process.env.PORT || 3000;
const user = process.env.HTTP_USER;
const hash = process.env.HTTP_PASS;
const domain = process.env.PROJECT_DOMAIN;
//glitch PROJECT_DOMAIN
// Create an Express app
var app = express();
var settings = {
  httpAdminRoot: "/red/",
  httpNodeRoot: "/api/",
  uiPort: 3000,
  functionGlobalContext: {    // enables global context
    // os:require('os'),
  },
  adminAuth: {
    type: "credentials",
    users: [{  //node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 8));"
      username: process.env.NODE_RED_USER,
      password: process.env.NODE_RED_PW,
      permissions: "*"
    }]
  },
  debugMaxLength: 1000,
  debugUseColors: true,
  flowFile: 'flows.json',
  userDir: __dirname+'/node-red',
  nodesDir:__dirname+'/node-red/nodes',
  ui: { path: "ui" },
  logging: {
    console: {
      level: "trace"
    }
  }
};

var authfunc = (req, res, next) => {
    const credentials = auth(req);
    if (credentials) {
        const { name, pass } = credentials
        if (name ===user && bcrypt.compareSync(pass, hash)) {
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
app.use('/api/ui',authfunc);
app.use("/", express.static("public"));
app.post('/upload', multer({ dest: 'public/' }).single('file'), function (req, res, next) {
	const dest = "public/"+path.basename(req.file.originalname);
    const src = req.file.path;
    fs.renameSync(src, dest);
    var url="https://"+domain+".glitch.me/"+dest;
    res.send('uploaded '+url);
  });
var server = http.createServer(app);
// Initialise the runtime with a server and settings
RED.init(server, settings);

// Serve the editor UI from /
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /
app.use(settings.httpNodeRoot, RED.httpNode);

server.listen(port);

RED.start();
