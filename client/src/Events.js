function Events(props) {
  let pair;
  if (props.events.length > 0) {
    if (props.events[0]) {
      pair = <div className="pair">
        <div className="event">{props.events[0]}</div>
        <div className="event">{props.events[1]}</div>
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
  
  return (
    <div className="events">
      <p>Two events from the year</p>
      <p className="year">{(props.year > 0 ? props.year + " AD" : props.year * -1 + " BC")}</p>
      {pair}
    </div>
  );
}

export default Events;