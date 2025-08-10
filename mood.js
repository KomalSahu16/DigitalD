function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

document.querySelectorAll('.mood-card').forEach(card => {
  card.addEventListener('click', () => {
    let mood = card.getAttribute('data-mood');

    if (mood === 'surprise') {
      // Generate two random colors
      const color1 = getRandomColor();
      const color2 = getRandomColor();

      // Store gradient in localStorage
      localStorage.setItem('surpriseGradient', JSON.stringify({color1, color2}));

      mood = 'surprise';
    }

    localStorage.setItem('selectedMood', mood);
    window.location.href = "entry.html";
  });
});
