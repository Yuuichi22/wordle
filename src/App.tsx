import React, { useState, useEffect } from "react";
import "./App.css";

// Import or define your list of five-letter words
import wordList from "./wordList.json"; // Ensure this is an array of five-letter words

function App() {
  return (
    <div className="App">
      <h2>W O R D L E</h2>
      <Wordle />
    </div>
  );
}

export default App;

export function Wordle() {
  const [lineNumber, setLineNumber] = useState(0);
  const [index, setIndex] = useState(0);
  const [solution, setSolution] = useState([]);
  const [guesses, setGuesses] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(null))
  );
  const [feedback, setFeedback] = useState(
    Array(6).fill(Array(5).fill("incorrect"))
  );
  const [gameStatus, setGameStatus] = useState(""); // "win" or "lose"

  useEffect(() => {
    // Select a random word from the word list
    const randomWord =
      wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    setSolution(randomWord.split(""));
  }, []);

  useEffect(() => {
    const handleEvent = (event) => {
      if (gameStatus) return; // Stop input if game is over

      if (lineNumber >= 6) {
        setGameStatus("lose");
        return;
      }

      if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key) && index < 5) {
        setGuesses((prevGuesses) => {
          const newGuesses = prevGuesses.map((row, rowIndex) =>
            rowIndex === lineNumber
              ? row.map((char, charIndex) =>
                  charIndex === index ? event.key.toUpperCase() : char
                )
              : row
          );
          return newGuesses;
        });

        setIndex((prevIndex) => prevIndex + 1);
      } else if (event.key === "Backspace" && index > 0) {
        setGuesses((prevGuesses) => {
          const newGuesses = prevGuesses.map((row, rowIndex) =>
            rowIndex === lineNumber
              ? row.map((char, charIndex) =>
                  charIndex === index - 1 ? null : char
                )
              : row
          );
          return newGuesses;
        });

        setIndex((prevIndex) => prevIndex - 1);
      } else if (event.key === "Enter" && index >= 5) {
        const guess = guesses[lineNumber];
        const answer = solution;
        const feedbackArray = Array(5).fill("incorrect");

        // Assign correct and misplaced feedback
        for (let i = 0; i < 5; i++) {
          if (guess[i] === answer[i]) {
            feedbackArray[i] = "correct";
          } else if (answer.includes(guess[i])) {
            feedbackArray[i] = "misplaced";
          }
        }

        setFeedback((prevFeedback) => {
          const newFeedback = prevFeedback.map((row, rowIndex) =>
            rowIndex === lineNumber ? feedbackArray : row
          );
          return newFeedback;
        });

        if (guess.join("") === answer.join("")) {
          setGameStatus("win");
          return;
        }

        setLineNumber((prevLine) => prevLine + 1);
        setIndex(0);

        if (lineNumber === 5) {
          setGameStatus("lose");
        }
      }
    };

    window.addEventListener("keydown", handleEvent);

    return () => {
      window.removeEventListener("keydown", handleEvent);
    };
  }, [lineNumber, index, guesses, gameStatus, solution]);

  return (
    <div className="board">
      {guesses.map((guess, i) => (
        <div key={i} className="line">
          {guess.map((char, j) => (
            <div key={j} className={`tile ${feedback[i][j]}`}>
              {char == null ? " " : char}
            </div>
          ))}
        </div>
      ))}
      {gameStatus && <Dialog status={gameStatus === "win"} solution={solution} />}
    </div>
  );
}

export const Dialog = ({ status, solution }) => {
  return status ? (
    <div className="dialog">
      <h1>🎉 Congratulations!</h1>
      <h2>You Successfully Guessed The Word</h2>
      <button onClick={() => window.location.reload()}>Play Again</button>
    </div>
  ) : (
    <div className="dialog">
      <h2>❌ YOU LOST</h2>
      <h3>The Word was: {solution.join("")}</h3>
      <button onClick={() => window.location.reload()}>Play Again</button>
    </div>
  );
};
