import React, { Component } from 'react';
import './index.css';
import YearForm from './YearForm';
import Events from './Events';

class App extends Component {
  constructor(props) {
    super(props);

    this.randomise = this.randomise.bind(this);
    this.getRandomYear = this.getRandomYear.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generate = this.generate.bind(this);

    this.state = {
      year: this.getRandomYear(),
      events: ["", ""]
    };
  }

  componentDidMount() {
    this.generate();
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Horizontal History</h1>

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

  randomise() {
    this.setState({
      year: this.getRandomYear()
    });
    this.generate();
  }

  getRandomYear() {
    const MIN_YEAR = -2000;
    const MAX_YEAR = (new Date()).getFullYear();
    let year = Math.round(Math.random() * (MAX_YEAR - MIN_YEAR) + MIN_YEAR);
    return year;
  }

  handleInput(e) {
    console.log(e.target.value);
    this.setState({
      year: e.target.value
    });
  }

  handleSubmit() {
    this.generate();
  }

  generate() {
    this.setState({
      events: ["", ""]
    });
    console.log(this.state.year);
    fetch("/api/" + this.state.year)
      .then(res => res.json())
      .then(events => {
        console.log(events);
        if (!events) return;
        this.setState({
          events: events
        });
      });
  }
}

export default App;
