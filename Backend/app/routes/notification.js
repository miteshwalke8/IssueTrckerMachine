const notificationController = require("../controllers/notificationController");
const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth');

let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/notifications`;
    app.get(`${baseUrl}/read/:userId` , auth.isAuthorized, notificationController.getNotifications);

}


module.exports = {
    setRouter: setRouter
  }