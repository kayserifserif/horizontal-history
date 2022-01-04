import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api/:year", (req, res) => {
  getJSON(req.params.year)
    .then(json => getYearInfo(json))
    .then(results => res.json(results));
});

const INCLUDE_BIRTHS_DEATHS = false;

async function getJSON(year) {
  if (year == 0) return {};

  const MIN_UNFORMATTED_YEAR = 150;
  const MIN_SINGLE_YEAR = 1;
  const MIN_DECADE_YEAR = -1799;

  let stub;

  if (year >= MIN_UNFORMATTED_YEAR) {
    // year 150
    stub = year;
  } else if (year >= MIN_SINGLE_YEAR) {
    // year with BC/AD
    if (year > 0) {
      stub = "AD_" + year;
    } else {
      stub = (year * -1) + "_BC";
    }
  } else if (year >= MIN_DECADE_YEAR) {
    // 500s BC: 509-500
    // 490s BC: 499-490
    let decade = Math.floor((year * -1) / 10) * 10;
    stub = decade + "s_BC";
    if (decade % 100 === 0 && decade !== 0) {
      stub += "_(decade)";
    }
  } else {
    // 5th century BC: 500-401
    let century = Math.ceil((year * -1) / 100);
    stub = formatOrdinals(century) + "_century_BC";
  }

  let url = `https://en.wikipedia.org/w/api.php?action=parse&page=${stub}&format=json`;
  // console.log(url);
  let response = await fetch(url);
  let json = await response.json();
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

function getYearInfo(json) {
  let results = {
    title: "",
    numEvents: 0,
    pair: []
  }

  if (!("parse" in json)) {
    // console.log("Invalid query.");
    return {
      title: "",
      numEvents: 0,
      pair: []
    };
  }

  // set title
  results.title = json.parse.title;

  // get html object
  const body = json.parse.text["*"];
  const $ = cheerio.load(body);

  // get list of events
  let allEvents = [];
  $(".mw-parser-output > ul").each(function() {

    // look for headings
    let headings = [];
    let h4, h3, h2;
    // assume previous element is h4
    h4 = $(this).prev("h4");
    if (h4.length > 0) { // previous element is h4
      let h4text = h4.find(".mw-headline").text().trim();
      // add h4 to list of headings
      headings.unshift(h4text);
      // look for h3 in previous siblings
      h3 = $(this).prevUntil("h3").prev().last();
    } else { // previous element is not h4
      // assume previous element is h3
      h3 = $(this).prev("h3");
    }
    // h2
    if (h3.length > 0) {
      let h3text = h3.find(".mw-headline").text().trim();
      headings.unshift(h3text);
      h2 = $(this).prevUntil("h2").prev().last();
    } else {
      h2 = $(this).prev("h2");
      if (h2.length === 0) {
        h2 = $(this).prevUntil("h2").prev().last();
      }
    }
    if (h2.length > 0) {
      let h2text = h2.find(".mw-headline").text().trim();

      // checks
      if (!INCLUDE_BIRTHS_DEATHS && (h2text === "Births" || h2text === "Deaths")) return;
      if (h2text === "Bibliography") return;
      if (h2text === "External links") return;
      if (h2text === "References") return;
      if (h2text === "See also") return;

      headings.unshift(h2text);
    }

    // iterate through each list item
    $(this).children().each(function() {
      // remove superscripts
      $(this).find("sup").remove();

      // create event object
      let event = {
        headings: headings,
        text: $(this).text().trim()
      };

      // checks
      if (!event.text) return;

      // add to list of events
      allEvents.push(event);
    });
  });
  
  results.numEvents = allEvents.length;

  // validate
  if (allEvents.length < 2) {
    // console.log("Couldn’t find two events for this year.");
    return results;
  }

  // get two random events
  let pair = [null, null];
  pair[0] = getRandomEvent(allEvents);
  do {
    pair[1] = getRandomEvent(allEvents);
  } while (pair[1] === pair[0]);
  results.pair = pair;

  // console.log(results);
  
  return results;
}

function getRandomEvent(events) {
  let event = events[Math.floor(Math.random() * events.length)];
  return event;
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});