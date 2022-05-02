const fs = require("fs/promises");
const path = require("path");
const { getAttributes } = require("./utils");

let dataList = [];
let response = {
  success: true,
  errorMessage: "",
  data: dataList,
};

const getAllFiles = async (_dirPath = "/") => {
  let directoryData = {};

  console.log("Resolved Path: ", _dirPath);

  let stat = await fs.stat(_dirPath);
  let dirName = path.basename(_dirPath, path.extname(_dirPath));

  if (stat.isFile()) {
    directoryData[dirName] = {
      fullPath: _dirPath,
      extension: path.extname(_dirPath),
      type: "file",
      name: path.basename(_dirPath),
      attributes: getAttributes(stat),
    };

    dataList.push(directoryData);
  } else {
    let _dir = [];
    try {
      _dir = await fs.readdir(_dirPath, { withFileTypes: true });
    } catch (error) {}
    let promises = _dir.map(async (dir) =>
      getAllFiles(path.resolve(_dirPath, dir.name))
    );
    await Promise.all(promises);
  }
};

const getAllFilesResponse = (_path) => {
  return new Promise((resolve) => {
    try {
      dataList = [];
      response.data = [];
      response.errorMessage = "";

      let resolvedPath = path.parse(_path);
      resolvedPath = path.join(resolvedPath.dir, resolvedPath.name);

      //Check if valid path
      fs.access(resolvedPath)
        .then((x) => {
          //If path is valid, get all the files recursively
          getAllFiles(resolvedPath)
            .then(() => {
              response.data = dataList;
              resolve(response);
            })
            .catch((e) => {
              response.success = false;
              response.errorMessage = e.message;
              resolve(response);
            });
        })
        .catch((x) => {
          response.success = false;
          response.errorMessage = x.message;

          console.log("Access Error: ", x.message);
          resolve(response);
        });
    } catch (error) {
      response.success = false;
      response.errorMessage = error.message;
      response.data = [];

      resolve(response);
    }
  });
};

module.exports = getAllFilesResponse;
