import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api/:year", (req, res) => {
  getJSON(req.params.year)
    .then(json => getEvents(json))
    .then(events => res.json(events));
});

async function getJSON(year) {
  let yearFormatted;
  if (year > 0) {
    yearFormatted = "AD_" + year;
  } else if (year < 0) {
    yearFormatted = (year * -1) + "_BC";
  } else {
    return null;
  }
  console.log(yearFormatted);

  // year with BC/AD
  const formattedUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${yearFormatted}&format=json`;
  console.log(formattedUrl);
  let response = await fetch(formattedUrl);
  let json = await response.json();

  // year, plain
  if (json.parse.templates[0]["*"] === "Template:R from unnecessary disambiguation") {
    const unformattedUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${year}&format=json`;
    console.log(unformattedUrl);
    let response = await fetch(unformattedUrl);
    json = await response.json();
  }
  
  return json;
}

function getEvents(json) {
  // get html object
  const body = json.parse.text["*"];
  const $ = cheerio.load(body);
  let events = [];
  // get list elements of events
  $("div.mw-parser-output > ul li").each(function() {
    // add each event to the list
    events.push($(this).text().trim());
  });
  console.log(events);

  // validate
  if (events.length < 2) {
    console.log("Couldn’t find two events for this year.");
    return null;
  }

  // get two random events
  let pair = ["", ""];
  pair[0] = getRandomEvent(events);
  do {
    pair[1] = getRandomEvent(events);
  } while (pair[1] === pair[0]);
  return pair;
}

function getRandomEvent(events) {
  let event = events[Math.floor(Math.random() * events.length)];
  return event;
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});