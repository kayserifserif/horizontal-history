function YearForm(props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <input type="number" name="yearInput" id="nameInput" value={props.year} onChange={props.handleInput} />
      <button type="submit" id="submitBtn">Generate</button>
    </form>
  );
}

export default YearForm;