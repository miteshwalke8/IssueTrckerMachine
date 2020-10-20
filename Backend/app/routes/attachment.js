const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const appConfig = require("../../config/appConfig");
const attachments = require('../middlewares/attachments');
const attachmentController = require('../controllers/attachments')

//making connection with mongodb
const connection = mongoose.createConnection(appConfig.db.uri);
connection.once('open', () => {
  global.gridFS = Grid(connection.db, mongoose.mongo);
  global.gridFS.collection('uploads');
});

let setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}/file`;

  // POST /upload
  app.post(`${baseUrl}/upload`, attachments.upload.single('file'), attachmentController.uploadFile);

   /**
     * @apiGroup File 
     * @apiVersion 1.0.0
     * @api {post} /api/v1/file/upload Read
     * 
     * @apiParam {binary} file file to be uploaded. (body params)(required)
     * 
     * 
     * 
     * @apiSuccessExample {object} Success-Response:
     *{
    "filename": "910596200a38abc9ae7400740f9c1e3c.pdf",
    "bucketName": "uploads",
    "originalFileName": "dummy.pdf"
}
    */
  
  
   
  // GET /files/:filename
  app.get(`${baseUrl}/read/:filename`, attachmentController.fetchFile );
   
  // DELETE /files/:id
  app.delete(`${baseUrl}/delete/:filename`, attachmentController.deleteFile);
   
}

module.exports = {
  setRouter: setRouter
}