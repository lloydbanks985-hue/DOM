const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

const MAX_CHARS = 200;
const WARN_AT = 180;
const DRAFT_KEY = "noteDraft";
const THEME_KEY = "noteTheme";

function updateCounts() {
  const text = noteText.value;
  const chars = text.length;
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

  charCount.textContent = chars + " / " + MAX_CHARS + " characters";
  wordCount.textContent = words + (words === 1 ? " word" : " words");

  charCount.classList.toggle("warning", chars > WARN_AT && chars <= MAX_CHARS);
  charCount.classList.toggle("over", chars > MAX_CHARS);
}

function saveDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, noteText.value);
  } catch (e) {
    console.error("Could not save draft:", e);
  }
}

function clearNote() {
  noteText.value = "";
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.error("Could not remove draft:", e);
  }
  updateCounts();
}

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

function toggleTheme() {
  const isDark = !document.body.classList.contains("dark");
  applyTheme(isDark);
  try {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  } catch (e) {
    console.error("Could not save theme:", e);
  }
}

noteText.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});

noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearNote();
  }
});

clearBtn.addEventListener("click", clearNote);
themeToggle.addEventListener("click", toggleTheme);

// On load: restore draft and theme, then update the counters
try {
  const savedDraft = localStorage.getItem(DRAFT_KEY);
  if (savedDraft !== null) noteText.value = savedDraft;
  applyTheme(localStorage.getItem(THEME_KEY) === "dark");
} catch (e) {
  console.error("Could not read saved data:", e);
}
updateCounts();
