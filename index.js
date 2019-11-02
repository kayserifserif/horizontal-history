var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')
var prompt = require('prompt')

// set up command line prompt for user input
var schema = {
  properties: {
    year: {
      description: "Enter a non-zero year (postive for AD/CE, negative for BC/BCE)",
      type: "string",
      pattern: /^-[1-9][0-9]*|[1-9][0-9]*$/,
      message: 'Year must be a non-zero positive or negative integer.',
      required: true
    }
  }
}

// get user input
prompt.start();
prompt.get(schema, function(err, result) {
  if (err) {
    console.log(err);
    return 1;
  } else {
    var year = parseInt(result.year);
    var year_text = "";
    var url = ""; 
    if (year > 0) {
      year_text = "AD " + year;
      url = "https://en.wikipedia.org/wiki/AD_" + year;
    } else {
      year_text = (year * -1) + " BC";
      url = "https://en.wikipedia.org/wiki/" + (year * -1) + "_BC";
    }
    // try to find the wikipedia page for this year
    request(url, function(error, response, body) {
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
          console.log("Two events from the year " + year_text + " (date not listed if unknown/NA):");
          console.log(events[r1]);
          console.log(events[r2]);
        }
      }
    });
  }
});