import { Router } from "express";
import { readNotes, writeNotes } from "../utils/fileDb.js";

const router = Router();

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// GET /api/notes
router.get("/", async (req, res) => {
  const notes = await readNotes();
  res.json(notes);
});

// GET /api/notes/:id
router.get("/:id", async (req, res) => {
  const notes = await readNotes();
  const note = notes.find((n) => n.id === req.params.id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(note);
});

// POST /api/notes
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const notes = await readNotes();

  const newNote = {
    id: createId(),
    title,
    content,
    createdAt: new Date().toISOString()
  };

  notes.push(newNote);
  await writeNotes(notes);

  res.status(201).json(newNote);
});

router.put("/:id", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
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
      updatedAt: new Date().toISOString()
    };

    notes[idx] = updatedNote;
    await writeNotes(notes);

    res.json(updatedNote);
});

// DELETE /api/notes/:id
router.delete("/:id", async (req, res) => {
  const notes = await readNotes();
  const idx = notes.findIndex((n) => n.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  const deleted = notes.splice(idx, 1)[0];
  await writeNotes(notes);

  res.json({ message: "Note deleted", note: deleted });
});

export default router;
