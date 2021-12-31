function Events(props) {
  let pair;
  if (props.pair.length > 0) {
    if (props.pair[0] && props.pair[1]) {
      pair = <div className="pair">
        <Event event={props.pair[0]} />
        <Event event={props.pair[1]} />
      </div>;
    } else {
      pair = <div className="pair">
        <p>Loading&hellip;</p>
      </div>
    }
  } else {
    pair = <div className="pair">
      <p>No events found.</p>
    </div>
  }

  let url;
  if (props.title) {
    let stub = props.title.replace(" ", "_");
    url = `https://en.wikipedia.org/wiki/${stub}`;
  }

  return (
    <div className="events">
      <div className="year">
        <p>{props.title}</p>
        {url ? <p className="wikiLink"><a href={url}>link</a></p> : ""}
      </div>
      {pair}
    </div>
  );
}

function Event(props) {
  let headings = [];
  if (props.event.headings) {
    for (let heading of props.event.headings) {
      let headingSpan = <span className="heading" key={heading}>{heading}</span>;
      headings.push(headingSpan);
    }
  }
  return (
    <div className="event">
      <p className="eventText">
        <span className="headings">{headings}</span>
        {props.event.text}
      </p>
    </div>
  );
}

export default Events;