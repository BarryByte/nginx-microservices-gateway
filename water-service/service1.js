const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World1! from water-service");
});

app.listen(3001, () => {
  console.log("Water Service is running on port 3001");
});
