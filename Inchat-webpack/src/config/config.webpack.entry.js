/**
 * @description webpack entry文件名
 * @author gonghongchen
 */

 
const  path = require("path"),
    fs = require('fs');

module.exports = ((fs) => {
    const entry = {},
        names = [];

    fs.readdirSync(path.resolve(__dirname, "../js")).forEach((item) => {
        const name = item.substring(0, item.indexOf(".ts")),
            path = "./src/js/";
        entry[name] = path + item;
        names.push(name);
    });
    entry.babelPolyfill = "babel-polyfill";

    return {
        entry,
        names
    };
})(fs);