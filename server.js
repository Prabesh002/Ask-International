//declaration....
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");



require('dotenv').config();

const routes = require("./routes/manage-routes")

const sendEmail = require("./backend-scripts/Utility/contact")
const ImagesGrabber =  require("./backend-scripts/Utility/imageGrabber");
const projectRoutes = require('./project-routes');

//Usages
app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, "static")));
app.use('/uploads', express.static(path.join(__dirname, "Server-Data",  "uploads")));



//routes config
app.use("/", routes);
app.use("/",sendEmail)
app.use("/",ImagesGrabber);
app.use('/', projectRoutes);


//port
const port = 3000;
app.listen(port, () => {
  console.log("Server started on port 3000");
});