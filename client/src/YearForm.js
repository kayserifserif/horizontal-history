function YearForm(props) {
  let min = props.YEAR_RANGE[0];
  min = min * -1 + " BC";
  let max = props.YEAR_RANGE[1];
  max = "AD " + max;

  return (
    <form className="yearForm" onSubmit={props.handleSubmit}>

      <span className="rangeLabel" id="rangeLabelStart">{min}</span>
      <span className="rangeLabel" id="rangeLabelEnd">{max}</span>

      <input
        type="range" min={props.YEAR_RANGE[0]} max={props.YEAR_RANGE[1]} step="1"
        name="yearInput" id="yearInput"
        value={props.year}
        onChange={props.handleInput}
        onMouseUp={props.handleSubmit}
        onTouchEnd={props.handleSubmit} />

      <button
        type="button" id="randomBtn"
        onClick={props.randomise}>
          Randomise
        </button>

      <button
        type="button" id="refreshBtn"
        onClick={props.handleSubmit}>
          Refresh
        </button>

    </form>
  );
}

export default YearForm;