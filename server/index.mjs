import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api/:year", (req, res) => {
  // res.json({ message: "Hello from server!" });

  let year = req.params.year;
  let yearAffixed = "";
  let url = "https://en.wikipedia.org/wiki/";
  // let url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=";
  if (year > 0) {
    yearAffixed = "AD " + year;
    // url = "https://en.wikipedia.org/wiki/AD_" + year;
    url += "AD_" + year;
  } else {
    yearAffixed = (year * -1) + " BC";
    // url = "https://en.wikipedia.org/wiki/" + (year * -1) + "_BC";
    url += (year * -1) + "_BC";
  }

  console.log(url);

  // try to find the wikipedia page for this year
  fetch(url)
    .then(res => res.text())
    .then(body => {
      let events = parse(body, yearAffixed);
      console.log(events);
      // return events;
      res.json(events);
    });
});

function parse(body, yearAffixed) {
  // get html elements
  let $ = cheerio.load(body);
  // set up to collect events
  let events = [];
  // get list elements of events
  $("div.mw-parser-output > ul li").each(function(index) {
    // add event to the list
    events.push($(this).text().trim());
  });

  // validation
  if (events.length < 2) {
    // red fg color
    console.log("Couldn’t find information for this year!");
    return;
  }

  // get two random events
  let r1 = Math.floor(Math.random() * events.length);
  let r2 = r1;
  while (r2 === r1) {
    r2 = Math.floor(Math.random() * events.length);
  }

  let pair = [events[r1], events[r2]];
  return pair;
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});