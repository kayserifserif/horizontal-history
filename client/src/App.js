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

    this.YEAR_RANGE = [
      -3000,
      (new Date()).getFullYear()
    ];

    this.state = {
      year: this.getRandomYear(),
      title: "",
      pair: [{}, {}],
      numEvents: 0
    };
  }

  componentDidMount() {
    this.generate();
  }

  render() {
    return (
      <>
        <header>
          <h1 className="title">Horizontal History</h1>
          <p>Juxtaposing two historical events from the same year, decade, or century.</p>
        </header>

        <main>

          <YearForm
            year={this.state.year}
            handleInput={this.handleInput}
            handleSubmit={this.handleSubmit}
            randomise={this.randomise}
            YEAR_RANGE={this.YEAR_RANGE} />
        
          <Events
            year={this.state.year}
            title={this.state.title}
            pair={this.state.pair}
            numEvents={this.state.numEvents} />
            
        </main>
        
        <footer>
          <p><small>Data is obtained from Wikipedia through the <a href="https://www.mediawiki.org/wiki/API:Main_page">MediaWiki API</a>. Dates use BC/AD in accordance with Wikipedia styles. Open sourced on <a href="https://github.com/whykatherine/horizontalhistory">GitHub</a>. Created by <a href="https://whykatherine.github.io">Katherine Yang</a>.</small></p>
        </footer>
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
    let min = this.YEAR_RANGE[0];
    let max = this.YEAR_RANGE[1];
    let year = Math.round(Math.random() * (max - min) + min);
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
        this.setState({
          title: results.title,
          pair: results.pair,
          numEvents: results.numEvents
        });
      });
  }
}

export default App;
