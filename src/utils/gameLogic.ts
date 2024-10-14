export function checkGuess(guess: string, secretWord: string): ('correct' | 'present' | 'absent')[] {
  const result: ('correct' | 'present' | 'absent')[] = [];
  const secretLetters = secretWord.split('');

  // First pass: mark correct letters
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secretWord[i]) {
      result[i] = 'correct';
      secretLetters[i] = '';
    }
  }

  // Second pass: mark present or absent letters
  for (let i = 0; i < guess.length; i++) {
    if (result[i]) continue;
    
    const index = secretLetters.indexOf(guess[i]);
    if (index !== -1) {
      result[i] = 'present';
      secretLetters[index] = '';
    } else {
      result[i] = 'absent';
    }
  }

  return result;
}

// Remove the isWordValid function as it's no longer needed