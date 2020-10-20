const appConfig = require("../../config/appConfig");
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');


  // Create storage engine
  const storage = new GridFsStorage({
    url: appConfig.db.uri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
            originalFileName: file.originalname
          };
          global.uploadedFileInfo = fileInfo;
          resolve(fileInfo);
         
        });
      });
    }
  });

let upload = multer({ storage });

module.exports = { upload: upload };