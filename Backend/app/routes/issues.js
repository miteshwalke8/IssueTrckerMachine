const issueController = require("../controllers/issueController");
const auth = require('../middlewares/auth');
const appConfig = require("../../config/appConfig");

let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/issue`

    app.post(`${baseUrl}/create`, auth.isAuthorized, issueController.createIssue);

    app.put(`${baseUrl}/update/:issueId`, auth.isAuthorized, issueController.updateIssue);

    app.get(`${baseUrl}/read`, auth.isAuthorized, issueController.getIssues);

    app.get(`${baseUrl}/read/:issueNumber`, auth.isAuthorized, issueController.FetchIssueByNumber);

    app.post(`${baseUrl}/delete`, auth.isAuthorized, issueController.deleteIssue);


}
module.exports = {
    setRouter: setRouter
  }

