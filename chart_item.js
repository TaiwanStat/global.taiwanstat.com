var path = require('path');

var long_lists = require('./l/lists.json');
var real_lists = require('./r/lists.json');
var partial_arr = ["./include/partials/header.js", "./include/partials/start.js", "./include/partials/end.js", "./include/partials/footer.js", "./include/partials/head.js"];
var post_arr = [];

post_arr.push(long_lists);
post_arr.push(real_lists);

long_lists.data.page.forEach(function(p) {
  post_arr.push({
    "data": {
      "chart_description": p,
      "prefix": "l",
      "domain": "http://global.taiwanstat.com/"
    },
    "partials": './include/partials.js',
    "layout": path.join('l', p.url, "index.hbs"),
    "filename": path.join('l', p.url, "index.html")
  })
})

real_lists.data.page.forEach(function(p) {
  post_arr.push({
    "data": {
      "chart_description": p,
      "prefix": "r",
      "domain": "http://global.taiwanstat.com/"
    },
    "partials": './include/partials.js',
    "layout": path.join('r', p.url, "index.hbs"),
    "filename": path.join('r', p.url, "index.html")
  })
})



module.exports = post_arr;
