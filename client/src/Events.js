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
  
  let yearText = props.year;
  if (props.year > 0) {
    yearText += " AD";
  } else if (props.year < 0) {
    yearText *= -1;
    yearText += " BC";
  }

  return (
    <div className="events">
      <p>Two events from the year</p>
      <p className="year">{yearText}</p>
      {pair}
    </div>
  );
}

export default Events;