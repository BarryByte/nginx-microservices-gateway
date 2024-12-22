const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World2! from property-service.");
});

app.listen(3002, () => {
  console.log("Property Service is running on port 3002");
});
