// requirements
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
// in case we give the user the option of changing the folder in the future
const dirPath = __dirname;
const resizedFolder = path.join(dirPath, path.basename(`${dirPath} resized`));

function fromDir(startPath) {
  const filter = ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.svg'];
  const files = fs.readdirSync(startPath);
  for (let i = 0, filesLength = files.length; i < filesLength; i += 1) {
    const filename = path.join(startPath, files[i]);
    // checks if the current file has the extension type of an image
    if (filter.some((extension) => (path.extname(filename.toLowerCase()) === extension))) {
      const inStream = fs.createReadStream(filename);
      const outStream = fs.createWriteStream(path.join(resizedFolder, files[i]), { flags: 'w' });
      const transform = sharp().resize({ width: 500 });
      inStream.pipe(transform).pipe(outStream);
    }
  }
}

// creates the new folder where images will be stored
try {
  fs.access(resizedFolder);
} catch (error) {
  fs.mkdir(resizedFolder, (err) => {});
}
/*
fs.access(resizedFolder, (error) => {
  if (error) {
    fs.mkdir(resizedFolder, (err) => {
      if (err) {
        return console.log('why1');
      }
    });
    return console.log('why2');
  }
  return console.log('why3');
});
*/

fromDir(dirPath);
