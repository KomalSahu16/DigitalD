// moodConfig.js
const moodConfig = {
  happy: { type: 'solid', color: '#FFD700' },
  sad: { type: 'solid', color: '#87CEEB' },
  angry: { type: 'solid', color: '#FF4500' },
  calm: { type: 'solid', color: '#98FB98' },
  surprise: { type: 'gradient', color1: '#FFDEE9', color2: '#B5FFFC' },
  love: { type: 'gradient', color1: '#FF9A9E', color2: '#FAD0C4' }
};

function applyMoodBackground(mood, gradientOverride = null) {
  if (!mood) return;

  if (gradientOverride) {
    document.body.style.background = `linear-gradient(135deg, ${gradientOverride.color1}, ${gradientOverride.color2})`;
  } else {
    const config = moodConfig[mood];
    if (config.type === 'solid') {
      document.body.style.background = config.color;
    } else if (config.type === 'gradient') {
      document.body.style.background = `linear-gradient(135deg, ${config.color1}, ${config.color2})`;
    }
  }
}
