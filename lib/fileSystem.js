// dependencies
const path = require('path');
const fs = require('fs');

// file system object
const fileSystem = {};

// get root dir
fileSystem.baseDir = path.join(__dirname, '/../database/');

// create file
fileSystem.create = (dir, fileName, data, callback) => {
    fs.open(`${fileSystem.baseDir + dir}/${fileName}.json`, 'wx', (createError, fileDes) => {
        if (!createError && fileDes) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDes, stringData, (writeError) => {
                if (!writeError) {
                    fs.close(fileDes, (closeError) => {
                        if (!closeError) {
                            callback(false);
                        } else {
                            callback(closeError);
                        }
                    });
                } else {
                    callback(writeError);
                }
            });
        } else {
            callback(createError);
        }
    });
};

// read file
fileSystem.read = (dir, fileName, callback) => {
    fs.readFile(`${fileSystem.baseDir + dir}/${fileName}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

// update file
fileSystem.update = (dir, fileName, data, callback) => {
    fs.open(`${fileSystem.baseDir + dir}/${fileName}.json`, 'r+', (readError, fileDes) => {
        if (!readError && fileDes) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDes, (trunError) => {
                if (!trunError) {
                    fs.writeFile(fileDes, stringData, (writeError) => {
                        if (!writeError) {
                            fs.close(fileDes, (closeError) => {
                                if (!closeError) {
                                    callback(false);
                                } else {
                                    callback(closeError);
                                }
                            });
                        } else {
                            callback(writeError);
                        }
                    });
                } else {
                    callback(trunError);
                }
            });
        } else {
            callback(readError);
        }
    });
};

// delete file
fileSystem.delete = (dir, fileName, callback) => {
    fs.unlink(`${fileSystem.baseDir + dir}/${fileName}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback(err);
        }
    });
};

// module export
module.exports = fileSystem;
