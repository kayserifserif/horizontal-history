function YearForm(props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <input
        type="range" min="-2000" max="2000" step="1"
        name="yearInput" id="yearInput"
        value={props.year}
        onChange={props.handleInput}
        onMouseUp={props.handleSubmit}
        onTouchEnd={props.handleSubmit} />
      <button
        type="button" id="randomBtn"
        onClick={props.randomise}>
          Randomise</button>
    </form>
  );
}

export default YearForm;