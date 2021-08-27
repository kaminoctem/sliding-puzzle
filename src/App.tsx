import "../node_modules/spectre.css/dist/spectre.min.css";
import "../node_modules/spectre.css/dist/spectre-exp.min.css";
import "../node_modules/spectre.css/dist/spectre-icons.min.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import SlidingPuzzleGame from "./phaser/SlidingPuzzleGame";

function App() {
  const [state, setState] = useState<SlidingPuzzleGame>();
  useEffect(() => {
    const game = new SlidingPuzzleGame();
    setState(game);
  }, []);

  return (
    <div className="App">
      <header className="navbar">
        <section className="navbar-section">
          <a className="navbar-brand mr-2">
            Sliding Puzzle
          </a>
          <a
            href="https://kaminoctem.com/games/sliding-puzzle"
            className="btn btn-link"
          >
            <i className="icon icon-link"></i>Original
          </a>
          <a
            href="https://github.com/kaminoctem/sliding-puzzle"
            className="btn btn-link"
          >
            <i className="icon icon-link"></i>GitHub
          </a>
        </section>
        <section className="navbar-section"></section>
      </header>
      <div className="container">
        <div className="row">
          <div className="column">
            <div className="p-centered">
              <div id="game" className="game"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
