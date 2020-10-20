const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const response = require('../libs/responseLib');
const check = require('../libs/checkLib');
const notificationController = require("../controllers/notificationController");
const IssueModel = mongoose.model('Issue');
const logger = require('../libs/loggerLib');


/* ----------- Create issue ------------*/
let createIssue = (req, res) => {
    let newIssue = new IssueModel({
        issueId: shortid.generate(),
        issueType: req.body.issueType,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        reporterUserId: req.body.reporterUserId,
        assigneeUserId: req.body.assigneeUserId,
        reporterName: req.body.reporterName,
        assigneeName: req.body.assigneeName,
        attachments: req.body.attachments,
        estimate: req.body.estimate,
        watchers: req.body.watchers,
        comments: req.body.comments,
        createdDate: moment.utc().format()
    });
    newIssue.save((err, createdIssue) => {
        if (err) {
            let apiResponse = response.generate(false, 'Unable to create issue', 500, null);
            res.send(apiResponse);
        }
        // else if (check.isEmpty(result)) {
        //     let apiResponse = response.generate(true, 'Invalid user', 200, null);
        //     res.send(apiResponse);
        // }
        else {
            generateNotification(createdIssue, 'created');
            let apiResponse = response.generate(false, 'Issue created successfully', 200, createdIssue)
            res.send(apiResponse);
        }
    })


}

let updateIssue = (req, res) => {
    let findIssue = () => {
        return new Promise((resolve, reject) => {
            if (req.params.issueId) {
                console.log(req.params);
                IssueModel.findOne({ issueId: req.params.issueId }, (err, findIssueResult) => {
                    if (err) {
                        logger.error(err, 'issueController: updateIssue()');
                        let apiResponse = response.generate(true, 'some error occured, failed to find issue ', 404, null);
                        reject(apiResponse)
                    } else if (check.isEmpty(findIssueResult)) {
                        let apiResponse = response.generate(true, 'Issue not found', 404, null);
                        reject(apiResponse);
                    } else {
                        resolve(findIssueResult);
                    }
                });
            } else {
                let apiResponse = response.generate(true, 'failed to update the issue', 500, null);
                reject(apiResponse);
            }
        })
    }

    let update = (findIssueResult) => {
        return new Promise((resolve, reject) => {
            let options = req.body;
            IssueModel.updateOne({ issueId: req.params.issueId }, options, (err, updatedIssue) => {
                if (err) {
                    let apiResponse = response.generate(true, 'Some error occured', 500, null);
                    reject(apiResponse)
                } else if (check.isEmpty(updateIssue)) {
                    let apiResponse = response.generate(true, 'failed to update issue', 404, null);
                    reject(apiResponse)
                } else {
                    findIssueResult.lastUpdatedBy = options.lastUpdatedBy;
                    findIssueResult.lastUpdatedDate = options.lastUpdatedDate;
                    generateNotification(findIssueResult, 'updated');
                    resolve(updatedIssue);

                }
            })
        })
    }
    findIssue()
        .then(update)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Issue updated', 200, resolve);
            res.send(apiResponse)
        }).catch((err) => {
            let apiResponse = response.generate(true, 'Some error occured', 500, err);
            res.send(apiResponse);
        });

}

/*------------ GET ISSUE --------------*/
let getIssues = (req, res) => {
    IssueModel.find()
        .select('-_id -__v')
        .lean()
        .exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'some error occureed, unable to get issue', 500, null);
                res.send(apiResponse);
                logger.error(err, 'issueController:getIssue()');

            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'no issue find ', 404, null);
                res.send(apiResponse)
            }
            else {
                let apiResponse = response.generate(false, 'issue found in the system', 200, result);
                res.send(apiResponse)
            }
        })

}

/*--------------Get issue by issueNumber start ------------ */

let FetchIssueByNumber = (req, res) => {
    IssueModel.find({ issueNumber: req.params.issueNumber })
        .select('-_id -__v')
        .lean()
        .exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, ' error while finding issue for selected user', 500, null);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'No issues found', 404, null);
                res.send(apiResponse);
            } else {
                let apiResponse = response.generate(false, 'Issue found', 200, result);
                res.send(apiResponse);
            }
        });
}

let FetchNotificationReceivers = (issueObject) => {
    let notificationReceivers = [];
    notificationReceivers.push(issueObject.assigneeUserId);
    notificationReceivers.push(issueObject.reporterUserId);
    if(issueObject.watchers && issueObject.watchers.length > 0) {
        issueObject.watchers.forEach(watcher => notificationReceivers.push(watcher));
 
    }
    const unique = [...new Set(notificationReceivers)];
    return unique;

}

let generateNotification = (issueObject, action) => {
    let notificationReceivers = FetchNotificationReceivers(issueObject)
    notificationReceivers.forEach(receiver => {
        if(receiver) {
            let notification = {
                notificationIssueId: issueObject.issueId,
                notificationIssueNumber: issueObject.issueNumber,
                receiverUserId: receiver,
                message: `Below issue ${action} by <b>${issueObject.lastUpdatedBy ? issueObject.lastUpdatedBy : issueObject.reporterName}</b> on 
                 ${issueObject.lastUpdatedDate? issueObject.lastUpdatedDate : issueObject.createdDate} <br/> <b>ID-${issueObject.issueNumber}</b>: ${issueObject.title}`
                }
                notificationController.createNotifications(notification);

        }
    })
}

/*-------------- delete issue ------------*/

let deleteIssue = (req, res) => {
    let findIssue = () => {
        return new Promise((resolve, reject) => {
            IssueModel.findOne({ issueId: req.body.issueId }, (err, result) => {
                if (err) {
                    let apiResponse = response.generate(true, 'some error occureed, unable to get issue', 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'Issue not found', 404, null);
                    reject(apiResponse);
                } else {
                    resolve(result);
                }
            });

        })
    }
    let deleteSomeIssue = () => {
        return new Promise((resolve, reject) => {
                IssueModel.findOneAndRemove({ issueId: req.body.issueId }, (err, deleteResult) => {
                    if (err) {
                        let apiResponse = response.generate(true, 'some error occureed, unable to get issue', 500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(deleteResult)) {
                        let apiResponse = response.generate(true, 'Issue not found', 404, null);
                        reject(apiResponse);
                    } else {
                        resolve(deleteResult);
                    }
                })
            
       })
    }
    findIssue()
        .then(deleteSomeIssue)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Issue deleted', 200, resolve);
            res.send(apiResponse);
        }).catch((err) => {
            let apiResponse = response.generate(true, 'some error occurred', 500, err);
            res.send(apiResponse);
        });
}


module.exports = {
    createIssue: createIssue,
    updateIssue: updateIssue,
    getIssues: getIssues,
    FetchIssueByNumber: FetchIssueByNumber, 
    deleteIssue: deleteIssue
}

