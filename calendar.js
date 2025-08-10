const monthYearEl = document.getElementById("month-year");
const calendarGrid = document.getElementById("calendar-grid");
const entryModal = document.getElementById("entry-modal");
const modalDateEl = document.getElementById("modal-date");
const entriesListEl = document.getElementById("entries-list");

const searchInput = document.getElementById("search-input");
const moodFilter = document.getElementById("mood-filter");

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const ENTRIES_PER_PAGE = 5; // Pagination size
let currentPage = 1;
let currentFilteredEntries = []; // Store filtered entries for pagination

function getMoodColor(mood) {
  const colors = {
    happy: "#FFD54F",
    sad: "#90CAF9",
    love: "#de5bdeff",
    relaxed: "#A5D6A7",
    surprise: "#6f10a5ff"
  };
  return colors[mood] || "#E0E0E0";
}

function deleteEntryByTimestamp(timestamp) {
  let entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
  entries = entries.filter(e => e.timestamp !== timestamp);
  localStorage.setItem('moodEntries', JSON.stringify(entries));

  // Refresh calendar UI after delete
  loadCalendar(currentMonth, currentYear);

  // Remove selectedEntry if deleted
  const selectedEntry = JSON.parse(localStorage.getItem('selectedEntry'));
  if (selectedEntry && selectedEntry.timestamp === timestamp) {
    localStorage.removeItem('selectedEntry');
  }
}

function renderEntriesPage(page) {
  entriesListEl.innerHTML = "";
  if (currentFilteredEntries.length === 0) {
    entriesListEl.innerHTML = "<p>No entries found for this search and mood.</p>";
    return;
  }

  const start = (page - 1) * ENTRIES_PER_PAGE;
  const end = start + ENTRIES_PER_PAGE;
  const pageEntries = currentFilteredEntries.slice(start, end);

  pageEntries.forEach(e => {
    const card = document.createElement("div");
    card.classList.add("entry-card");
    card.style.background = getMoodColor(e.mood);
    card.style.position = "relative";
    card.style.paddingRight = "100px";

    card.innerHTML = `
      <strong>${e.title}</strong><br>
      <span class="entry-time">${e.time}</span> - <em>${e.mood}</em>
    `;

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.style.position = "absolute";
    delBtn.style.top = "8px";
    delBtn.style.right = "8px";
    delBtn.style.backgroundColor = "#ff4d4d";
    delBtn.style.color = "white";
    delBtn.style.border = "none";
    delBtn.style.padding = "4px 8px";
    delBtn.style.borderRadius = "4px";
    delBtn.style.cursor = "pointer";

    delBtn.onclick = (event) => {
      event.stopPropagation();
      if (confirm(`Delete entry "${e.title}"?`)) {
        deleteEntryByTimestamp(e.timestamp);
        applyFilters(); // Refresh modal after deletion
      }
    };

    // Update button
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.style.position = "absolute";
    updateBtn.style.top = "8px";
    updateBtn.style.right = "70px";
    updateBtn.style.backgroundColor = "#4CAF50";
    updateBtn.style.color = "white";
    updateBtn.style.border = "none";
    updateBtn.style.padding = "4px 8px";
    updateBtn.style.borderRadius = "4px";
    updateBtn.style.cursor = "pointer";

    updateBtn.onclick = (event) => {
      event.stopPropagation();
      localStorage.setItem("entryToEdit", JSON.stringify(e));
      window.location.href = "mood.html";
    };

    card.appendChild(updateBtn);
    card.appendChild(delBtn);

    card.addEventListener("click", () => openJournalView(e));
    entriesListEl.appendChild(card);
  });

  renderPaginationControls(page);
}

function renderPaginationControls(page) {
  // Remove old controls if any
  const oldControls = document.getElementById("pagination-controls");
  if (oldControls) oldControls.remove();

  if (currentFilteredEntries.length <= ENTRIES_PER_PAGE) return; // No pagination needed

  const totalPages = Math.ceil(currentFilteredEntries.length / ENTRIES_PER_PAGE);
  const paginationDiv = document.createElement("div");
  paginationDiv.id = "pagination-controls";
  paginationDiv.style.marginTop = "10px";
  paginationDiv.style.textAlign = "center";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = page === 1;
  prevBtn.style.marginRight = "10px";
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderEntriesPage(currentPage);
    }
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = page === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderEntriesPage(currentPage);
    }
  };

  paginationDiv.appendChild(prevBtn);
  paginationDiv.appendChild(document.createTextNode(` Page ${page} of ${totalPages} `));
  paginationDiv.appendChild(nextBtn);

  entriesListEl.appendChild(paginationDiv);
}

function openModal(date, entries, filterText = "", moodValue = "") {
  modalDateEl.textContent = date;
  currentPage = 1; // Reset page to 1 on modal open

  const text = filterText.toLowerCase();

  currentFilteredEntries = entries.filter(e => {
    const matchesText =
      e.title.toLowerCase().includes(text) ||
      e.experience.toLowerCase().includes(text) ||
      e.mood.toLowerCase().includes(text) ||
      e.quote.toLowerCase().includes(text);

    const matchesMood = moodValue ? e.mood === moodValue : true;

    return matchesText && matchesMood;
  });

  if (currentFilteredEntries.length === 0) {
    entriesListEl.innerHTML = "<p>No entries found for this search and mood.</p>";
    entryModal.style.display = "flex";
    return;
  }

  renderEntriesPage(currentPage);
  entryModal.style.display = "flex";
}

function applyFilters() {
  const filterText = searchInput.value.trim();
  const moodValue = moodFilter.value;
  const currentDate = modalDateEl.textContent;
  if (!currentDate) return;

  const entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
  const dayEntries = entries.filter(e => e.date === currentDate);

  openModal(currentDate, dayEntries, filterText, moodValue);
}

searchInput.addEventListener("input", applyFilters);
moodFilter.addEventListener("change", applyFilters);

function loadCalendar(month, year) {
  calendarGrid.innerHTML = "";
  monthYearEl.textContent = `${new Date(year, month).toLocaleString("default", { month: "long" })} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayCell = document.createElement("div");
    dayCell.classList.add("calendar-day");
    dayCell.textContent = day;

    const dayEntries = entries.filter(e => e.date === dateStr);
    if (dayEntries.length > 0) {
      const indicator = document.createElement("div");
      indicator.classList.add("entry-indicator");
      indicator.textContent = dayEntries.length;
      dayCell.appendChild(indicator);

      dayCell.addEventListener("click", () => {
        searchInput.value = "";
        moodFilter.value = "";
        openModal(dateStr, dayEntries);
      });
    }

    calendarGrid.appendChild(dayCell);
  }
}

function openJournalView(entry) {
  localStorage.setItem("selectedEntry", JSON.stringify(entry));
  window.location.href = "pastentry.html";
}

document.getElementById("close-modal").addEventListener("click", () => {
  entryModal.style.display = "none";
});
document.getElementById("close-journal").addEventListener("click", () => {
  document.getElementById("journal-modal").style.display = "none";
});

document.getElementById("prev-month").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  loadCalendar(currentMonth, currentYear);
});
document.getElementById("next-month").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  loadCalendar(currentMonth, currentYear);
});

loadCalendar(currentMonth, currentYear);

window.onpopstate = () => {
  window.location.href = 'redirect.html';
};
document.getElementById('back-to-home').addEventListener('click', () => {
  window.location.href = 'redirect.html';
});
document.getElementById('newentry').addEventListener('click',() =>{
    window.location.href = 'mood.html';

})