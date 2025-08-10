// Mood background set karna (agar yeh page pe zarurat ho toh)
const selectedMood = localStorage.getItem('selectedMood');
let gradientData = null;

if (selectedMood === 'surprise') {
  gradientData = JSON.parse(localStorage.getItem('surpriseGradient')) || null;
}

if (selectedMood) {
  if (gradientData) {
    // Gradient background apply karo
    document.body.style.background = `linear-gradient(135deg, ${gradientData.color1}, ${gradientData.color2})`;
  } else {
    // Simple mood class add karo
    document.body.classList.add(selectedMood);
  }
}

// Form elements
const titleInput = document.getElementById("title");
const experienceInput = document.getElementById("experience");
const quoteInput = document.getElementById("quote");
const moodSelect = document.getElementById("mood-select");  // assume ye mood dropdown hai

// 1. DOMContentLoaded pe entryToEdit ke sath-saath draft bhi check karo aur prefill karo
document.addEventListener("DOMContentLoaded", () => {
  const entryToEdit = JSON.parse(localStorage.getItem("entryToEdit"));
  const draft = JSON.parse(localStorage.getItem("entryDraft"));

  if (entryToEdit) {
    // Edit mode prefilling
    titleInput.value = entryToEdit.title || "";
    experienceInput.value = entryToEdit.experience || "";
    quoteInput.value = entryToEdit.quote || "";
    if (moodSelect && entryToEdit.mood) {
      moodSelect.value = entryToEdit.mood;
    }
    window.isEditMode = true;
    window.editingEntryTimestamp = entryToEdit.timestamp;
    localStorage.removeItem("entryDraft"); // cleanup draft on edit load (optional)
  } else if (draft) {
    // Draft se prefill karo, jab new entry ho aur draft ho
    titleInput.value = draft.title || "";
    experienceInput.value = draft.experience || "";
    quoteInput.value = draft.quote || "";
    if (moodSelect && draft.mood) {
      moodSelect.value = draft.mood;
    }
    window.isEditMode = false;
    window.editingEntryTimestamp = null;
  } else {
    window.isEditMode = false;
    window.editingEntryTimestamp = null;
  }
});

// 2. Mood change hone par draft save karo
if (moodSelect) {
  moodSelect.addEventListener("change", () => {
    saveDraft();
  });
}

// 3. Form ke inputs pe bhi draft save karo taaki har update safe rahe
[titleInput, experienceInput, quoteInput].forEach(input => {
  input.addEventListener("input", saveDraft);
});

function saveDraft() {
  const draft = {
    title: titleInput.value,
    experience: experienceInput.value,
    quote: quoteInput.value,
    mood: moodSelect ? moodSelect.value : selectedMood || ""
  };
  localStorage.setItem("entryDraft", JSON.stringify(draft));
}

// 4. Save button pe save karo aur draft remove karo
document.getElementById('save-entry').addEventListener('click', () => {
  const title = titleInput.value.trim();
  const experience = experienceInput.value.trim();
  const quote = quoteInput.value.trim();

  // Mood select ki value le lo agar dropdown hai
  let mood = selectedMood;
  if (moodSelect) {
    mood = moodSelect.value || selectedMood || "";
  }

  // Agar mood surprise hai toh gradient fetch karo
  let gradient = null;
  if (mood === 'surprise') {
    gradient = JSON.parse(localStorage.getItem('surpriseGradient')) || null;
  }

  if (!title || !experience) {
    alert("Please fill in both title and experience.");
    return;
  }

  let allEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];
  let entry = {};

  if (window.isEditMode && window.editingEntryTimestamp) {
    // Update existing entry, preserve date/time
    const oldEntry = allEntries.find(e => e.timestamp === window.editingEntryTimestamp);
    if (!oldEntry) {
      alert("Original entry not found, cannot update!");
      return;
    }
    entry = {
      mood,
      gradient,
      title,
      experience,
      quote,
      timestamp: oldEntry.timestamp,
      date: oldEntry.date,
      dateISO: oldEntry.dateISO || oldEntry.date,
      time: oldEntry.time,
      day: oldEntry.day
    };

    // Replace the old entry with updated one
    allEntries = allEntries.map(e => (e.timestamp === window.editingEntryTimestamp ? entry : e));
    localStorage.removeItem("entryToEdit");  // cleanup edit flag
  } else {
    // New entry banani hai
    const now = new Date();
    entry = {
      mood,
      gradient,
      title,
      experience,
      quote,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('en-CA'),
      dateISO: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      day: now.toLocaleDateString('en-US', { weekday: 'long' })
    };

    allEntries.push(entry);
  }

  // Save all entries back to localStorage
  localStorage.setItem('moodEntries', JSON.stringify(allEntries));

  // Draft ab clear kar do because data saved ho gaya
  localStorage.removeItem("entryDraft");

  alert(window.isEditMode ? "Entry updated successfully!" : "Entry saved successfully!");
  window.location.href = "redirect.html";  // ya calendar.html, jaisa chahiye
});
