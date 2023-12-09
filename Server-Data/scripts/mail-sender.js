const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "prabeshpathak02@gmail.com",
        pass: "pzqvfqbekahwywre",
    },
});

    function sendEmail(receiver, topic, message, callback) {
        const mailOptions = {
            from: "prabeshpathak02@gmail.com",
            to: "prabeshpathak003@gmail.com",
            subject: topic,
            html: message
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                callback("Error sending email");
            } else {
                console.log("Email sent:", info.messageId);
                callback(null, "Email sent successfully");
            }
        });
    }
module.exports = { sendEmail };  