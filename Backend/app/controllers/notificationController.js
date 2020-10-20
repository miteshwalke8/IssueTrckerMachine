const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const response = require('../libs/responseLib');
const UserModel = mongoose.model('User');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');
const nodemailer = require('../libs/nodemailer');
const NotificationModel = mongoose.model('Notification');

/* Create method for creating and saving the notification */
let createNotifications = (req, res)  => {
    let newNotification = new NotificationModel({
        notificationId: shortid.generate(),
        notificationIssueNumber:req.notificationIssueNumber,
        notificationId:req.notificationId,
        receiverUserId:req.receiverUserId,
        message:req.message,
        dateTime: moment.utc().format()
    })
    newNotification.save((err, newNotification) => {
        if(err) {
            console.log(err);
            logger.error(err.message, 'notificationController: createNotification' , 10)
                    }
                    else {
                        let createdNotificationEmail = newNotification.toObject()
                        sendNotificationEmail(createdNotificationEmail)
                        logger.info('notification created successfully' , 'notificationController: createNotification' , 10)
                    }
    })

}

/* get notifications */
let getNotifications = (req, res) => {
    NotificationModel.find({ receiverUserId:req.params.userId})
    .select('-_id -__v')
    .lean()
    .exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'notification Controller: getNotification', 10)
            let apiResponse = response.generate(true, 'Some error occured, getting the notification failed', 500, null);
            res.send(apiResponse);
        } else if (check.isEmpty(result)) {
            logger.info('No notification Found', 'notification Controller: getNotification')
            let apiResponse = response.generate(true, 'No notifications found for selected user', 404, null);
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, 'Notification found', 200, result);
            res.send(apiResponse);
        }
    })
}

/* get user */
let getUser = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            UserModel.findOne({ 'userId': userId })
                .select('-password -__v -_id')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        logger.error(err, 'notoficationController:getUser()');
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
        } catch (err) {
            logger.error(err, 'notoficationController:getUser()');
            reject(err);
        }
    })
}
let sendNotificationEmail = (createdNotification) => {
    getUser(createdNotification.receiverUserId).then(user => {
        if (user && user.email) {
            nodemailer.sendEmail(user.email, 'Notification',
                `Hello user, <br/><br/> You have got a new notification:<br/> 
                 ${createdNotification.message} 
                 <br/> <br/> Thank you :-), <br/> Issue Tracker.`);
        }
    })
}

module.exports = {
    getNotifications: getNotifications,
    createNotifications: createNotifications
}

