const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  events = require('events'),  // custom events
  express = require('express');


// Module tutorial:
const modules = {
  readWrite: false,
  createServer: true,
};


/**
 * read/write
 */
modules.readWrite && (() => {
  // Resource:
  //https://stackabuse.com/writing-to-files-in-node-js/

  // reading
  const dir = './dist';
  const htmlMarkup = (`<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <title>Title of the document</title>
  </head>
  <body>
  Content of the document......
  </body>
  </html>`);

  // Write dynamic htmlMarkup
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.writeFile('./dist/index.html', htmlMarkup, (err) => console.log(err || 'saved!'));
  };

  var filePath = path.join(__dirname, './dist/index.html');
  fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => console.log(err || data));
})();


/**
  * Server
  */
modules.createServer && (() => {
  debugger;
  const dir = './dist';
  const htmlMarkup = (`<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <title>Title of the document</title>
  </head>
  <body>
  Content of the document......
  </body>
  </html>`);

  const app = http.createServer((req, res) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.writeFile('./dist/index.html', htmlMarkup, (err) => console.log(err || 'saved!'));
    };

    const filePath = path.join(__dirname, './dist/index.html');
    fs.readFile(filePath, {encoding: 'utf-8'}, (err, html) => {

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(html);
    });
  });
  console.log('Running server');

  var port = process.env.PORT || 5000;
  app.listen(port, () => console.log("Listening on " + port));
})();
