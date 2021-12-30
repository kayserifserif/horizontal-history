import React, { Component } from 'react';
import './index.css';
import YearForm from './YearForm';
import Events from './Events';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      year: 1,
      events: ["", ""]
    };

    this.handleInput = this.handleInput.bind(this);
    this.randomise = this.randomise.bind(this);
    this.setYear = this.setYear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generate = this.generate.bind(this);
  }

  componentDidMount() {
    this.randomise();
    this.generate();
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Horizontal History</h1>

          <p>Enter a non-zero year (positive for AD/CE, negative for BC/BCE).</p>

          <YearForm
            year={this.state.year}
            handleInput={this.handleInput}
            handleSubmit={this.handleSubmit}
            randomise={this.randomise} />
        </header>
      
        <Events
          year={this.state.year}
          events={this.state.events} />
      </div>
    );
  }

  handleInput(e) {
    this.setYear(e.target.value);
  }

  randomise() {
    const MIN_YEAR = -2000;
    const MAX_YEAR = new Date().getFullYear();
    let year = Math.round(Math.random() * (MAX_YEAR - MIN_YEAR) + MIN_YEAR);
    this.setYear(year);
    this.generate();
  }

  setYear(year) {
    this.setState({
      year: year
    });
  }

  handleSubmit() {
    this.generate();
  }

  generate() {
    this.setState({
      events: ["", ""]
    });
    fetch("/api/" + this.state.year)
      .then(res => res.json())
      .then(events => this.setState({
        events: events
      }));
  }
}

export default App;
