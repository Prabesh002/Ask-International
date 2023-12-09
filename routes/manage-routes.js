const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "html", "home.html"));

});
router.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "html", "contact.html"));

});
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "html", "login.html"));

});

router.get("/monitor", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "html", "admin.html"));

});



router.get("/redirect", (req, res) => {
    res.redirect("/");
});



module.exports = router;