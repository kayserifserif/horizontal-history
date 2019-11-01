var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')
var prompt = require('prompt')

// set up variables for user input in command line
var prompt_attributes = [
  {
    name: 'year'
  }
]

// get user input
prompt.start();
prompt.get(prompt_attributes, function(err, result) {
  if (err) {
    console.log(err);
    return 1;
  } else {
    var year = result.year;
    // try to find the wikipedia page for this year
    request("https://en.wikipedia.org/wiki/AD_" + year, function(error, response, body) {
      if (error) {
        console.log("Error: " + error);
        return 1;
      } else {
        // get html elements
        var $ = cheerio.load(body);
        // set up to collect events
        var events = [];
        // get list elements of events
        $("div.mw-parser-output > ul li").each(function(index) {
          // add event to the list
          events.push($(this).text().trim());
        });
        // validation
        if (events.length < 2) {
          console.log("Couldn’t find information for this year!");
          return 1;
        } else {
          // get two random events
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