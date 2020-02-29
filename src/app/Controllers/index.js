const fs = require('fs');
const path = require('path');

function indexControllers(app) {
  fs.readdirSync(__dirname)
    .filter(file => (((file.indexOf('.')) !== 0) && (file !== "index.js")))
    .forEach(file => app.use(require(path.resolve(__dirname, file))));
};

module.exports = indexControllers;