document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('entries-container');
  const allEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];

  if (allEntries.length === 0) {
    container.innerHTML = "<p>No entries found.</p>";
    return;
  }

  // Mood colors
  const moodStyles = {
    happy: "linear-gradient(135deg, #FFD700, #FFB347)",
    sad: "linear-gradient(135deg, #89CFF0, #4682B4)",
    love: "linear-gradient(135deg, #FF69B4, #FF1493)",
    surprise: null // Random for surprise
  };

  allEntries.forEach(entry => {
    const card = document.createElement('div');
    card.classList.add('entry-card');

    // Mood-specific background
    if (entry.mood === 'surprise') {
      const gradient = JSON.parse(localStorage.getItem('surpriseGradient')) || {
        color1: "#ff9a9e", 
        color2: "#fad0c4"
      };
      card.style.background = `linear-gradient(135deg, ${gradient.color1}, ${gradient.color2})`;
    } else {
      card.style.background = moodStyles[entry.mood] || "#fff";
    }

    card.innerHTML = `
      <h3>${entry.title}</h3>
      <small>${entry.day}, ${entry.date} at ${entry.time}</small>
      <p><strong>Mood:</strong> ${entry.mood}</p>
      <p>${entry.experience}</p>
      ${entry.quote ? `<blockquote>"${entry.quote}"</blockquote>` : ""}
    `;

    container.appendChild(card);
  });
});

