import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api/:year", (req, res) => {
  getJSON(req.params.year)
    .then(json => getEvents(json))
    .then(results => res.json(results));
});

async function getJSON(year) {
  if (year == 0) return null;

  let json;

  const MIN_UNFORMATTED_YEAR = 150;
  if (year > MIN_UNFORMATTED_YEAR) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${year}&format=json`;
    console.log(url);
    let response = await fetch(url);
    json = await response.json();
  } else {
    // year with BC/AD
    let yearFormatted;
    if (year > 0) {
      yearFormatted = "AD_" + year;
    } else if (year < 0) {
      yearFormatted = (year * -1) + "_BC";
    }
    const formattedUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${yearFormatted}&format=json`;
    console.log(formattedUrl);
    let response = await fetch(formattedUrl);
    json = await response.json();
  }

  // handle redirects
  let cat = json.parse.categories[0]["*"];
  let stub;
  if (cat === "Redirects_from_unnecessary_disambiguation") {
    stub = year;
  } else if (cat === "Redirects_to_a_decade") {
    let yearPlain = (year * -1) - 1;
    let decade = Math.floor(yearPlain / 10);
    stub = decade + "0s_BC";
  } else if (cat === "Redirects_to_a_century") {
    let yearPlain = (year * -1) - 1;
    let century = Math.floor(yearPlain / 100);
    stub = formatOrdinals(century) + "_century_BC";
  }
  if (stub) {
    const redirectUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${stub}&format=json`;
    console.log(`Redirecting to ${redirectUrl}`);
    let response = await fetch(redirectUrl);
    json = await response.json();
  }
  
  return json;
}

function formatOrdinals(n) {
  const pr = new Intl.PluralRules("en-US", { type: "ordinal" });
  const suffixes = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"]
  ]);
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
}

function getEvents(json) {
  let results = {
    title: json.parse.title,
    events: []
  };

  // get html object
  const body = json.parse.text["*"];
  const $ = cheerio.load(body);
  let eventsList = [];
  // get list elements of eventsList
  $("div.mw-parser-output > ul li").each(function() {
    // add each event to the list
    eventsList.push($(this).text().trim());
  });

  // validate
  if (eventsList.length < 2) {
    console.log("Couldn’t find two events for this year.");
    return results;
  }

  // get two random events
  let pair = ["", ""];
  pair[0] = getRandomEvent(eventsList);
  do {
    pair[1] = getRandomEvent(eventsList);
  } while (pair[1] === pair[0]);
  
  results.events = pair;
  
  return results;
}

function getRandomEvent(events) {
  let event = events[Math.floor(Math.random() * events.length)];
  return event;
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});