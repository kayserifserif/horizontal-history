const http = require("http");
const express = require("express");
const app = express();

const port = 3000;

app.set("view engine", "pug");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.use(function (req, res, next) {
  res.status(404).send("Sorry, can't find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});