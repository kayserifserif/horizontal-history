var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')
var prompt = require('prompt')

var prompt_attributes = [
  {
    name: 'year'
  }
]

prompt.start();

prompt.get(prompt_attributes, function(err, result) {
  if (err) {
    console.log(err);
    return 1;
  } else {
    var year = result.year;
    request("https://en.wikipedia.org/wiki/AD_" + year, function(error, response, body) {
      if (error) {
        console.log("Error: " + error);
        return 1;
      } else {
        var $ = cheerio.load(body);

        var events = [];
        $("div.mw-parser-output > ul li").each(function(index) {
          events.push($(this).text().trim());
        });
        if (events.length < 2) {
          console.log("Couldn’t find a page for this year!");
          return 1;
        } else {
          var r1 = Math.floor(Math.random() * events.length);
          var r2 = r1;
          while (r2 == r1) {
            r2 = Math.floor(Math.random() * events.length);
          }
          console.log("Two events from the year " + year + " (if not listed, date is unknown/NA):");
          console.log(events[r1]);
          console.log(events[r2]);
        }
      }
    });
  }
});