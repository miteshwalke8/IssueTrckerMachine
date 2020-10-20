const nodemailer = require('nodemailer');
const logger = require('../libs/loggerLib');
const response = require('../libs/responseLib');
const appConfig = require("../../config/appConfig");

let sendEmail = (toEmail, title, message) => {
    return new Promise((resolve) => {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587 ,
            service: 'gmail',
        //    // secureConnection: 'false',
        //    // tls: {
        //         ciphers: 'SSLv3',
        //         rejectUnauthorized: false
        //     //},
        //     
        auth: {
                user: 'mehtanakuul06@gmail.com',
                pass: 'nacool14111997'
            }
        });
        const mailOptions = {
            from: '"HelpDesk" <noReply@gmail.com>',
            to: toEmail,
            subject: `Issue Tracking Tool: ${title}`,
            html: message,
            text: "Hey User, Don't worry we got you coverd ;-)"
        };
        try{
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    logger.error('Sent Mail Failed!', 'nodemailer.sendMail', 10);
                    let apiResponse = response.generate(true, 'Send email failed', 500, null);
                    resolve(apiResponse);
                }
                else {
                    logger.info('Mail Sent Successfully to your registerd email', 'nodemailer.sendMail', 10);
                    resolve(info);
                }
            });
        }catch (err){
            resolve(err);
        }
    });
}

module.exports = { sendEmail: sendEmail }

// const nodemailer = require("nodemailer");



// async function sendMail(mailOptions) {

//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth: {
//             user: 'chaser156@gmail.com',
//             pass: 'redshirt@123',
//         },
//     });

//     let info = await transporter.sendMail(mailOptions);

// }

// module.exports.sendMail = sendMail;