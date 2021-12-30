function Events(props) {
  return (
    <div className="events">
      <p>Two events from the year</p>
      <p className="year">{(props.year > 0 ? props.year + " AD" : props.year * -1 + " BC")}</p>
      <p>(date not listed if unknown/NA):</p>
      <div className="pair">
        <div className="event">{props.events[0]}</div>
        <div className="event">{props.events[1]}</div>
      </div>
    </div>
  );
}

export default Events;