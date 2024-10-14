import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import { checkGuess } from './utils/gameLogic';

const WORDS = ['FALL', 'ARBOR', 'TOWN', 'FEST', 'ALL', 'CHEER', 'FOR', 'PLOTSIE', 'THE', 'BEST'];
const MAX_ATTEMPTS = 6;
const INITIAL_LIVES = ['🐱', '🧙', '🦊', '🥳', '👨‍🎤', '🤓', '🐸', '🤠', '🌝', '😘', '🐙', '👸', '🐹', '🐥', '👽'];
const GHOST_EMOJI = '👻';

function App() {
  const [secretWord, setSecretWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [lives, setLives] = useState<string[]>([...INITIAL_LIVES]);
  const [winningWords, setWinningWords] = useState<string[]>([]);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const isLowOnLives = lives.filter(emoji => emoji !== GHOST_EMOJI).length <= 2;
  const noLivesRemaining = lives.every(emoji => emoji === GHOST_EMOJI);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    if (roundsPlayed >= WORDS.length || noLivesRemaining) {
      endGame();
      return;
    }

    const newSecretWord = WORDS[roundsPlayed];
    setSecretWord(newSecretWord);
    setGuesses([]);
    setCurrentGuess('');
    setMessage('');
  };

  const endGame = () => {
    setSecretWord('');
    setIsGameOver(true);
    setMessage("You tragic monkey! You've lost! Tell Alma immediately!");
  };

  const handleKeyPress = (key: string) => {
    if (isGameOver || !secretWord) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== secretWord.length) {
        setMessage(`The word must be ${secretWord.length} letters long.`);
        return;
      }
      setGuesses(prevGuesses => [...prevGuesses, currentGuess]);
      if (currentGuess === secretWord) {
        handleWin();
      } else if (guesses.length + 1 === MAX_ATTEMPTS) {
        handleLoss();
      } else {
        reduceLives();
      }
      setCurrentGuess('');
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < secretWord.length) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const handleWin = () => {
    const adjectives = ['beautiful', 'gorgeous', 'stunning', 'lovely', 'charming', 'elegant', 'graceful', 'radiant', 'dazzling', 'exquisite'];
    const animals = ['goose', 'duck', 'swan', 'flamingo', 'penguin', 'pelican', 'heron', 'stork', 'crane', 'albatross'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    setMessage(`Correct! You ${randomAdjective} ${randomAnimal}!`);
    setWinningWords(prev => [...prev, secretWord]);
    setRoundsPlayed(prev => prev + 1);
    setTimeout(startNewRound, 3000);
  };

  const handleLoss = () => {
    const adjectives = ['silly', 'goofy', 'foolish', 'absurd', 'ridiculous', 'ludicrous', 'comical', 'hilarious', 'wacky', 'zany'];
    const animals = ['frog', 'mouse', 'hamster', 'gerbil', 'squirrel', 'chipmunk', 'hedgehog', 'ferret', 'rabbit', 'guinea pig'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    setMessage(`You ${randomAdjective} ${randomAnimal}! The word was ${secretWord}.`);
    setWinningWords(prev => [...prev, secretWord]);
    reduceLives();
    setRoundsPlayed(prev => prev + 1);
    if (!noLivesRemaining) {
      setTimeout(startNewRound, 3000);
    }
  };

  const reduceLives = () => {
    setLives(prevLives => {
      const newLives = [...prevLives];
      const aliveIndices = newLives.reduce((acc, emoji, index) => emoji !== GHOST_EMOJI ? [...acc, index] : acc, [] as number[]);
      if (aliveIndices.length > 0) {
        const randomIndex = aliveIndices[Math.floor(Math.random() * aliveIndices.length)];
        newLives[randomIndex] = GHOST_EMOJI;
        if (newLives.every(emoji => emoji === GHOST_EMOJI)) {
          endGame();
        }
      }
      return newLives;
    });
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${isLowOnLives ? 'bg-red-100' : 'bg-gray-100'}`}>
      <h1 className="text-4xl font-bold mb-2 text-blue-600">PHIRLDLE</h1>
      {!isGameOver ? (
        <>
          <div className="text-2xl mb-2">{lives.join(' ')}</div>
          <p className="text-lg mb-4 text-gray-600">
            {roundsPlayed + 1}/10 words played
          </p>
          {winningWords.length > 0 && (
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {winningWords.map((word, index) => (
                <span key={index} className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                  {word}
                </span>
              ))}
            </div>
          )}
          {message && (
            <div className="mb-4 flex items-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          <GameBoard guesses={guesses} currentGuess={currentGuess} secretWord={secretWord} />
          <Keyboard onKeyPress={handleKeyPress} guesses={guesses} secretWord={secretWord} />
        </>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-bold mb-4 text-red-600">{message}</p>
          <button
            onClick={() => {
              setLives([...INITIAL_LIVES]);
              setWinningWords([]);
              setRoundsPlayed(0);
              setIsGameOver(false);
              startNewRound();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            I've told Alma, I want to try again.
          </button>
        </div>
      )}
    </div>
  );
}

export default App;