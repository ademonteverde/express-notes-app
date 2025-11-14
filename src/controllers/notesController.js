import { readNotes, writeNotes } from "../utils/fileDb.js";

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// GET /api/notes
export async function getAllNotes(req, res) {
  try {
    const notes = await readNotes();
    const { search } = req.query;

    if (!search) {
      return res.json(notes);
    }

    const q = search.toLowerCase();

    const filtered = notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const content = note.content?.toLowerCase() || "";
      return title.includes(q) || content.includes(q);
    });

    res.json(filtered);
  } catch (err) {
    console.error("Error getting all notes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/notes/:id
export async function getNoteById(req, res) {
  try {
    const notes = await readNotes();
    const note = notes.find((n) => n.id === req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    console.error("Error getting note by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/notes
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const notes = await readNotes();

    const newNote = {
      id: createId(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    notes.push(newNote);
    await writeNotes(notes);

    res.status(201).json(newNote);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// PUT /api/notes/:id
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const notes = await readNotes();
    const idx = notes.findIndex((n) => n.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    const existingNote = notes[idx];

    const updatedNote = {
      ...existingNote,
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    notes[idx] = updatedNote;
    await writeNotes(notes);

    res.json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// PATCH /api/notes/:id
export async function patchNote(req, res) {
  try {
    const { title, content } = req.body;

    if (title === undefined && content === undefined) {
      return res
        .status(400)
        .json({ message: "At least one of title or content is required" });
    }

    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    if (content !== undefined && content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const notes = await readNotes();
    const idx = notes.findIndex((n) => n.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    const existingNote = notes[idx];

    const updatedNote = {
      ...existingNote,
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      updatedAt: new Date().toISOString(),
    };

    notes[idx] = updatedNote;
    await writeNotes(notes);

    res.json(updatedNote);
    await writeNotes(notes);

    res.json(updatedNote);
  } catch (err) {
    console.error("Error patching note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/notes/:id
export async function deleteNote(req, res) {
  try {
    const notes = await readNotes();
    const idx = notes.findIndex((n) => n.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    const deleted = notes.splice(idx, 1)[0];
    await writeNotes(notes);

    res.json({ message: "Note deleted", note: deleted });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
