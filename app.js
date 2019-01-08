const pug = require('pug');

const compiledFunction = pug.compileFile('src/pug/index.pug');

var siteData = {};

console.log(compiledFunction(siteData));
