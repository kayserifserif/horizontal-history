function Events(props) {
  let pair;
  if (props.pair.length > 0) {
    if (Object.keys(props.pair[0]).length !== 0) {
      pair = <div className="pair">
        <Event event={props.pair[0]} />
        <Event event={props.pair[1]} />
      </div>;
    } else {
      pair = <div className="pair">
        <EventPlaceholder />
        <EventPlaceholder />
      </div>;
    }
  } else {
    pair = <div className="pair">
      <p>No events found.</p>
    </div>;
  }

  let url, numEvents;
  if (props.title) {
    let stub = props.title.replace(" ", "_");
    url = `https://en.wikipedia.org/wiki/${stub}`;
    let itemPlural = (props.numEvents === 1 ? "item" : "items");
    numEvents = <div className="numEvents">{props.numEvents} list {itemPlural} on <a href={url}>Wikipedia</a></div>;
  } else {
    numEvents = <div className="numEvents"><div className="placeholder"></div></div>;
  }

  return (
    <div className="events">
      <div className="yearInfo">
        <div className="year">{props.title ? props.title : props.year}</div>
        {numEvents}
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

function EventPlaceholder() {
  return (
    <div className="event">
      <div className="placeholder"></div>
      <div className="placeholder"></div>
    </div>
  );
}

export default Events;