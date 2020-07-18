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
    if (filter.some((extension) => (filename.toLowerCase().indexOf(extension) >= 0))) {
      let inputFile = filename;
      let outputFile = path.join(resizedFolder, files[i]);
      sharp(inputFile).resize({ width: 1040 }).toFile(outputFile);
      /*
      const inStream = fs.createReadStream(filename);
      const outStream = fs.createWriteStream(path.join(resizedFolder, files[i]), { flags: 'w' });
      inStream.once('open', (fd) => {
          outStream.once('open', (fd) => {
            const transform = sharp().resize({ width: 500 });
            inStream.pipe(transform).pipe(outStream);
          });
          outStream.end();
        });
      */
    }
  }
}

// creates the new folder where images will be stored
fs.access(resizedFolder, (error) => {
  if (error) {
    fs.mkdir(resizedFolder, (err) => {
      if (err) {
        return err;
      }
    });
    return error;
  }
  return error;
});

fromDir(dirPath);
