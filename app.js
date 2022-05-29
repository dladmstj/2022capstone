const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 8001;
const imageDirectory = "public/images";

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, imageDirectory);
    },
    filename: function (req, file, cb) {
      fs.readdir(imageDirectory, (err, files) => {
        cb(null, `${files.length + 1}${path.extname(file.originalname)}`);
      });
    },
  }),
});

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "./public")));

app.get("/", async (req, res) => {
  try {
    res.render("index.ejs");
  } catch (err) {
    console.error(err);
  }
});

app.get("/webcam_emotion", async (req, res) => {
  try {
    res.render("webcam_emotion.ejs");
  } catch (err) {
    console.error(err);
  }
});

app.get("/add_image", async (req, res) => {
  try {
    res.render("add_image.ejs");
  } catch (err) {
    console.error(err);
  }
});

app.get("/education_emotion", async (req, res) => {
  try {
    res.render("education_emotion.ejs");
  } catch (err) {
    console.error(err);
  }
});

app.get("/img-title", (req, res) => {
  try {
    fs.readdir(imageDirectory, (err, files) => {
      let number = Math.floor(Math.random() * files.length);
      console.log(files[number]);
      res.json({
        title: files[number],
      });
    });
  } catch (err) {
    console.error(err);
  }
});

app.post("/upload", upload.single("img"), async (req, res) => {
  try {
    fs.readdir(imageDirectory, (err, files) => {
      res.status(201).send({
        title: files.length,
      });
    });
  } catch (err) {
    console.error(err);
  }
});

app.get("/test", async (req, res) => {
  try {
    res.render("test.ejs");
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
