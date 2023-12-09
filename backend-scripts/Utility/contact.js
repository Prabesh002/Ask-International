const express = require("express");
const { sendEmail } = require('../../Server-Data/scripts/mail-sender');

const router = express.Router();

router.post("/sendEmail", (req, res) => {
    const { receiver, topic, message } = req.body;

    //Send mail function from "/server-data/mail-sender"
    sendEmail(receiver, topic, message, (error, result) => {
        if (error) {
            res.status(500).json({ message: "Error sending email" });
        } else {
            res.json({ message: "Email sent successfully" });
        }
    });
});

module.exports = router;