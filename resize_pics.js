// requirements
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const port = 3000;
// array which will contain the images in base64
let images64 = [];
// in case we give the user the option of changing the folder in the future
const dirPath = __dirname;
const resizedFolder = path.join(dirPath, path.basename(`${dirPath} resized`));

// creates the new folder where images will be stored
try {
  fs.access(resizedFolder);
} catch (error) {
  fs.mkdir(resizedFolder, (err) => {});
}
/* this method of creating the folder throws an error
fs.access(resizedFolder, (error) => {
  if (error) {
    fs.mkdir(resizedFolder, (err) => {
      if (err) {
        return console.log('why1');
      }
    });
    return console.log('why2');
  }
});
*/

// turn images to base64
function base64Encode(file) {
  const bitmap = fs.readFileSync(file);
  return Buffer.from(bitmap).toString('base64');
}

function fromDir(startPath) {
  const filter = ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.svg'];
  const files = fs.readdirSync(startPath);
  images64 = [];
  for (let i = 0, filesLength = files.length; i < filesLength; i += 1) {
    const filename = path.join(startPath, files[i]);
    // checks if the current file has the extension type of an image
    if (filter.some((extension) => (path.extname(filename.toLowerCase()) === extension))) {
      const inStream = fs.createReadStream(filename);
      const outStream = fs.createWriteStream(path.join(resizedFolder, files[i]), { flags: 'w' });
      const transform = sharp().resize({ width: 500 });
      // throw new Error('For testing');
      inStream.pipe(transform).pipe(outStream);
      images64.push(base64Encode(files[i]));
    }
  }
}

app.get('/resize', function controller(req, res) {
  try {
    fromDir(dirPath);
    res.status(200).json(images64);
  } catch (err) {
    res.status(400).send('Couldn\'t resize images.');
  }
});

app.listen(port);
