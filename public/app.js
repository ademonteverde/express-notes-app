const form = document.getElementById("note-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const listEl = document.getElementById("notes-list");
const searchInput = document.getElementById("search");
const formModeLabel = document.getElementById("form-mode");
const clearBtn = document.getElementById("form-clear");
const saveBtn = form.querySelector("button[type='submit']");


let notes = [];
let editingId = null;

// Fetch notes from the server
async function fetchNotes() {
  const res = await fetch("/api/notes");
  const data = await res.json();
  notes = data;
  renderNotes();
}

// Render notes to the list
function renderNotes() {
  const raw = searchInput.value || "";
  const q = raw.trim().toLowerCase();
  
  listEl.textContent = "";

  notes
    .filter((note) => {
      const title = (note.title ?? "").toLowerCase();
      const content = (note.content ?? "").toLowerCase();
      return title.includes(q) || content.includes(q);
    })
    .sort((a, b) => 
      new Date(b.createdAt) - 
      new Date(a.createdAt)
    )
    .forEach((note) => {
      const li = document.createElement("li");
      li.className = "note-item";

      const main = document.createElement("div");
      main.className = "note-main";

      const title = document.createElement("div");
      title.className = "note-title";
      title.textContent = note.title;

      const meta = document.createElement("div");
      meta.className = "note-meta";
      const timestamp = note.updatedAt || note.createdAt;
      meta.textContent = 
        (note.updatedAt ? "Updated: " : "Created: ") +
        new Date(timestamp).toLocaleString();

      main.appendChild(title);
      main.appendChild(meta);

      const del = document.createElement("button");
      del.className = "note-delete";
      del.textContent = "Delete";

      li.addEventListener("click", (e) => {
        if (e.target === del) return;
        enterEditMode(note);
      });

      del.addEventListener("click", async (e) => {
        e.stopPropagation();
        await deleteNote(note.id);
      });

      li.appendChild(main);
      li.appendChild(del);
      listEl.appendChild(li);
    });
}

// Enter edit mode for a note
function enterEditMode(note) {
  editingId = note.id;
  titleInput.value = note.title;
  contentInput.value = note.content;

  formModeLabel.textContent = "Editing Note";
  saveBtn.textContent = "Update Note";
  clearBtn.classList.remove("hidden");
}

// Reset form to initial state 
function resetForm() {
  editingId = null;
  titleInput.value = "";
  contentInput.value = "";

  formModeLabel.textContent = "New Note";
  saveBtn.textContent = "Save Note";
  clearBtn.classList.add("hidden");
}

// Update an existing note
async function updateNote(id, data) {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
    if (!res.ok) return alert("Error updating note");

    const updated = await res.json();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx !== -1) notes[idx] = updated;

    renderNotes();
}

// Delete a note
async function deleteNote(id) {
  const res = await fetch(`/api/notes/${id}`, {
    method: "DELETE"
  });
    if (!res.ok && res.status !== 404  ) {
        return alert("Error deleting note");
    }

    notes = notes.filter((n) => n.id !== id);
    renderNotes();

    if (editingId === id) resetForm();
    resetForm();
}

// Create a new note
async function createNote(note) {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  });

  if (!res.ok) {
    alert("Error creating note");
    return;
  }

  const created = await res.json();
  notes.unshift(created);
  renderNotes();
}

// Event listeners
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) return;

  if (editingId) {
    await updateNote(editingId, { title, content });
    } else {
    await createNote({ title, content });
  }

    resetForm();
});

// Clear button (Cancel Edit Btn)
clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm();
});

// Search input
searchInput.addEventListener("input", () => {
  renderNotes();
});

// Initial fetch of notes
fetchNotes().catch((err) => {
  console.error(err);
  alert("Failed to load notes.");
});
