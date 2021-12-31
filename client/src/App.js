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
      title: "",
      pair: [{}, {}]
    };
  }

  componentDidMount() {
    this.generate();
  }

  render() {
    return (
      <>
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
          title={this.state.title}
          pair={this.state.pair} />
      </>
    );
  }

  randomise() {
    let newYear = this.getRandomYear();
    this.setState({
      year: newYear
    }, this.generate);
  }

  getRandomYear() {
    const MIN_YEAR = -3000;
    const MAX_YEAR = (new Date()).getFullYear();
    let year = Math.round(Math.random() * (MAX_YEAR - MIN_YEAR) + MIN_YEAR);
    console.log(year);
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
    // loading
    this.setState({
      pair: [{}, {}]
    });

    fetch("/api/" + this.state.year)
      .then(res => res.json())
      .then(results => {
        console.log(results);

        if (results.pair.length === 0) {
          // no results
          this.setState({
            pair: []
          });
          return;
        }

        this.setState({
          title: results.title,
          pair: results.pair
        });
      });
  }
}

export default App;
