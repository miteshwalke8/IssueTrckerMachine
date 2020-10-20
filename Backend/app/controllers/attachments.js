const logger = require('../libs/loggerLib');

/* Uploading a file */

let uploadFile = (req,res) => {
    return res.status(200).json(global.uploadedFileInfo);
    console.log(global.uploadedFileInfo);
}

/* fetching the file */
let fetchFile = (req, res) => {
    try {
    global.gridFS.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (err) {
        logger.error(err, 'fileController:getFile()');
        return res.status(500).json({ err: 'Internal server error' });
      }
      if (!file || file.length === 0) {
        return res.status(404).json({ err: 'No file exists' });
      }
      const readstream = global.gridFS.createReadStream(file.filename);
      readstream.pipe(res);
    });
  } catch (err) {
    logger.error(err, 'fileController:getFile()');
    return res.status(500).json({ err: 'Internal server error' });
  }


}

/*-------------deleting the file---------*/
let deleteFile = (req, res) => {
    global.gridFS. remove({ fileName: req.params.fileName, root :'uploads'} , (err) => {
        if (err) {
            logger.error(err, 'attachments.deleteFile()');
            return res.status(404).json({err:err});
            
        }
        return res.status(200).json({message: 'File deleted'});

    })
}

module.exports = {
        uploadFile:uploadFile, 
        fetchFile:fetchFile, 
        deleteFile:deleteFile
}