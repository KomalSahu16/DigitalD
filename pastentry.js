document.addEventListener("DOMContentLoaded", () => {
  const entry = JSON.parse(localStorage.getItem("selectedEntry"));

  if (!entry) {
    alert("No entry selected!");
    window.location.href = "calendar.html";
    return;
  }

  // Mood ke hisaab se color mapping same as calendar
  const moodColors = {
    happy: "#FFD54F",    // yellowish-orange
    sad: "#90CAF9",      // greyish blue (blueish)
    angry: "#EF9A9A",    // reddish pink
    relaxed: "#A5D6A7",  // soft green
    surprise: "#CE93D8"  // purplish violet
  };

  // Background color set karo simple mood color se
  if (entry.mood && moodColors[entry.mood]) {
    document.body.style.background = moodColors[entry.mood];
  } else {
    document.body.style.background = "#fff8dc"; // default pale background
  }

  document.getElementById("entry-title").textContent = entry.title;

  const dateEl = document.getElementById("entry-date");
  if (dateEl && entry.date && entry.time && entry.day) {
    dateEl.textContent = `${entry.day}, ${entry.date} (${entry.time})`;
  }

  document.getElementById("entry-experience").textContent = entry.experience;

  const quoteEl = document.getElementById("entry-quote");
  if (entry.quote && entry.quote.trim() !== "") {
    quoteEl.textContent = `"${entry.quote}"`;
    quoteEl.style.display = "block";
  } else {
    quoteEl.style.display = "none";
  }

  // Update entry button
  document.getElementById("update-entry-btn").onclick = () => {
    localStorage.setItem("entryToEdit", JSON.stringify(entry));
    window.location.href = "mood.html";
  };

  // Delete entry button (Ab yahan listener lagaya hai)
  const deleteBtn = document.getElementById("delete-entry-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Delete entry "${entry.title}"?`)) {
        deleteEntryByTimestamp(entry.timestamp);
        alert("Entry deleted!");
        localStorage.removeItem("selectedEntry"); // clean up
        window.location.href = "calendar.html";  // Back to calendar after deletion
      }
    });
  }
});

// Helper function to delete entry by timestamp
function deleteEntryByTimestamp(timestamp) {
  let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
  entries = entries.filter(e => e.timestamp !== timestamp);
  localStorage.setItem("moodEntries", JSON.stringify(entries));
}
