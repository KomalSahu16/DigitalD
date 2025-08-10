// Simple mood-based quotes generator function
function generateQuote(mood) {
  const quotes = {
    happy: [
      "Happiness is a journey, not a destination.",
      "Smile, it's contagious!",
      "Every day is a fresh start."
    ],
    sad: [
      "Stars can’t shine without darkness.",
      "Tough times never last, but tough people do.",
      "Even the darkest night will end and the sun will rise."
    ],
    love: [
      "Love is composed of a single soul inhabiting two bodies.",
      "You are my today and all of my tomorrows.",
      "In your smile, I see something more beautiful than the stars."
    ],
    surprise: [
      "Life is full of surprises – embrace them!",
      "Expect the unexpected.",
      "Adventure begins where plans end."
    ]
  };

  const moodQuotes = quotes[mood] || quotes.happy;
  const randomQuote = moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
  return randomQuote;
}

// Event listener for generating quote
document.getElementById('generate-quote').addEventListener('click', () => {
  const mood = localStorage.getItem('selectedMood') || 'happy';
  document.getElementById('quote').value = generateQuote(mood);
});
