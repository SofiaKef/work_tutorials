const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

let filterType = ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.svg'];
let resizedFolder = path.join(__dirname, path.basename(__dirname) + " resized");

function fromDir(startPath, filter) {
    let files = fs.readdirSync(startPath);
    let inStream, outStream, transform;
    let filterLength = filter.length;

    for (let i = 0, filesLength = files.length; i < filesLength; i++) {
        var filename = path.join(startPath, files[i]);
        for (let z = 0; z < filterLength; z++) {
            if (filename.toLowerCase().indexOf(filter[z]) >= 0) {
                console.log('-- found: ', filename);
                // input stream
                inStream = fs.createReadStream(filename);
                // output stream
                outStream = fs.createWriteStream(path.join(resizedFolder, files[i]), { flags: "w" });
                transform = sharp()
                    .resize({ width: 500 })
                    .on('info', function(fileInfo) {
                        console.log("Resizing done");
                    });
                inStream.pipe(transform).pipe(outStream);
            };
        }
    };
};

//creates the new folder where images will be stored
fs.mkdir(resizedFolder, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
});

fromDir(__dirname, filterType);