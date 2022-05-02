const compression = require("compression");
const express = require("express");
const bodyParser = require("body-parser");
const getAllFilesResponse = require("./src/directoryBrowser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(compression());

app.get("/getallfiles", async (req, res) => {
  let path = req.query.path || "/";
  let index = req.query.index || 0;
  let limit = req.query.limit || 0;
  try {
    console.log("Request: ", { params: req.query, path, index, limit });
    let response = await getAllFilesResponse(path);
    if (limit > 0 && response.data && Array.isArray(response.data)) {
      try {
        response = response.data.slice(index, limit);
      } catch (e) {
        res.status(400).json(e.message);
      }
    }
    res.json(response);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

app.listen(5000, function () {
  console.log("App listening on port 5000!");
});
