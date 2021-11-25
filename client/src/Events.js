function Events(props) {
  return (
    <div class="events">
      <p>Two events from the year</p>
      <p class="year">{(props.year > 0 ? props.year + " AD" : props.year * -1 + " BC")}</p>
      <p>(date not listed if unknown/NA):</p>
      <div class="pair">
        <div className="event">{props.events[0]}</div>
        <div className="event">{props.events[1]}</div>
      </div>
    </div>
  );
}

export default Events;