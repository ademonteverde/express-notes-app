import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file that acts as our database
const dbPath = path.join(__dirname, '..', '..', 'data', 'notes.json');

// Ensure the database file exists
async function ensureDbFile() {
    try {
        await fs.access(dbPath);
    } catch {
        await fs.mkdir(path.dirname(dbPath), { recursive: true });
        await fs.writeFile(dbPath, '[]', 'utf-8');
    }
}

// Read notes from the database file
export async function readNotes() {
    await ensureDbFile();
    const raw = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(raw || '[]');
}

// Write notes to the database file
export async function writeNotes(notes) {
    await ensureDbFile();
    const data = JSON.stringify(notes, null, 2);
    await fs.writeFile(dbPath, data, 'utf-8');
}