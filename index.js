const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  events = require('events'),  // custom events
  express = require('express'),
  fileUpload = require('express-fileupload');

// Module tutorial:
const modules = {
  readWrite: false,
  server: false,
  express: false,
  serviceworker: false,
  fileUploader: true
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
modules.server && (() => {
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

  const app = http.createServer((request, response) => {

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.writeFile('./dist/index.html', htmlMarkup, (err) => console.log(err || 'saved!'));
    };

    const filePath = path.join(__dirname, './dist/index.html');

    fs.readFile(filePath, {encoding: 'utf-8'}, (err, html) => {

      // Text node (not html, ex: '<h1>hi</hi>')
      // response.writeHead(200, {'Content-Type': 'text/plain'});

      // Html, ex: Hi
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(html);
    });
  });

  const port = process.env.PORT || 5000;

  // Global Listeners
  app.listen(port, () => console.log("Listening on " + port));
  app.on('close', () => console.log("Closing down the server..."));
  app.on('request', () => console.log("Request"));
  app.on('response', () => console.log("response"));
})();


/**
  * Express
  */
modules.express && (() => {
  const app = express();
  const server = require('http').createServer(app);
  const dir = './dist';
  const htmlMarkupPath = '/dist/index.html';

  if (!fs.existsSync(dir)) {

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

    fs.mkdirSync(dir);
    fs.writeFile(`.${htmlMarkupPath}`, htmlMarkup, (err) => console.log(err || 'saved!'));
  }

  app.use(express.static(__dirname + '/public'));
  app.get('/', (request, response) => response.sendFile(__dirname + htmlMarkupPath));
  app.get('/text', (request, response) => response.send('<div>heello<span>what</span></div>'));
  app.get('/getJson', (request, response) => response.json('{a:1, b:2, c:3}'));

  server.listen(process.env.PORT || 5000);
})();


/**
  * Serviceworker (w/ Express)
  * https://developers.google.com/web/fundamentals/primers/service-workers/
  */
modules.serviceworker && (() => {
  const app = express();
  const server = require('http').createServer(app);
  const dir = './dist';
  const htmlMarkupPath = '/dist/index.html';

  if (!fs.existsSync(dir)) {

    const htmlMarkup = (`
      <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Title of the document</title>
        <script type="text/javascript" src="/script/script.js"></script>
        <script type="text/javascript" src="/script/registering.serviceworker.js"></script>
        </head>
        <body>
        Content of the document......
        </body>
        </html>`);

    fs.mkdirSync(dir);
    fs.writeFile(`.${htmlMarkupPath}`, htmlMarkup, (err) => console.log(err || 'saved!'));
  }

  app.use(express.static(__dirname + '/public'));
  app.get('/', (request, response) => response.sendFile(__dirname + htmlMarkupPath));

  server.listen(process.env.PORT || 5000);
})();


/**
  * fileUploader
  */
modules.fileUploader && (() => {
  debugger;

  const app = express();
  const server = require('http').createServer(app);
  const busboy = require('connect-busboy');
  const dir = './dist';
  const htmlMarkupPath = '/dist/index.html';


  if (!fs.existsSync(dir)) {

    const htmlMarkup = (`
      <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Title of the document</title>
        <script type="text/javascript" src="/script/script.js"></script>
        </head>
        <body>
          <form ref='uploadForm'
              id='uploadForm'
              action='/upload'
              method='post'
              encType="multipart/form-data">
                <input type="file" name="sampleFile" />
                <input type='submit' value='Upload!' />
          </form>
        </body>
        </html>`);

    fs.mkdirSync(dir);
    fs.writeFile(`.${htmlMarkupPath}`, htmlMarkup, (err) => console.log(err || 'saved!'));
  }

  app.use(busboy());
  app.use(express.static(__dirname + '/public'));
  app.get('/', (request, response) => response.sendFile(__dirname + htmlMarkupPath));
  app.post('/upload', (req, res) => {

    if(req.busboy) {
        req
          .busboy
          .on("file", (fieldName, fileStream, fileName, encoding, mimeType) => {

            // console.log(fieldName); // sampleFile
            // console.log(fileName); // ABDR6016.jpg
            // console.log(mimeType); // image/jpeg

            const fullFileName = `./uploads/${fileName}`;
            const fstream = fs.createWriteStream(fullFileName);

            fileStream.pipe(fstream);
            fstream.on('close', () => res.send('upload succeeded!'));
          });

        return req.pipe(req.busboy);
    }
  });

  server.listen(process.env.PORT || 5000);
})();
