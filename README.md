# Express Notes App
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5.0-black?style=for-the-badge&logo=express)
![JS](https://img.shields.io/badge/Vanilla_JS--F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

A lightweight notes application built with **Node.js**, **Express**, and plain **HTML/CSS/JS**.  
The project includes a small REST API and a simple UI for creating, editing, searching, and deleting notes.  
All notes are stored in a local JSON file—no external database required.

---

## Stack

- **Express.js (Router + Controllers)**
- **Node.js**
- **File-based JSON storage**
- **Vanilla JavaScript**
- **Nodemon** for development

---

## Scripts

```bash
npm run dev   # start with nodemon on http://localhost:4000
npm start     # start with node
```

---

## API Endpoints


| Method | Endpoint            | Description            |
|--------|----------------------|------------------------|
| GET    | /api/notes          | Get all notes          |
| GET    | /api/notes/:id      | Get a single note      |
| POST   | /api/notes          | Create a new note      |
| PUT    | /api/notes/:id   | Update an existing note |
| PATCH  | /api/notes/:id       | Partially update a note              |
| DELETE | /api/notes/:id      | Delete a note          |

### 🔍 Search Example

```
GET /api/notes?search=hello
```

Returns notes where the title or content contains **"hello"** (case-insensitive).

---

## Run it locally

```bash
npm run dev
```

Then open:

```
http://localhost:4000
```

Your notes will be saved to:

```bash
data/notes.json
```

---

## Features

- Create, edit, and delete notes  
- Search through saved notes  
- Timestamps for created/updated notes  
- Clean, simple UI  
- No database needed — everything runs locally
- Clean, responsive UI  
- Organized project structure with **controllers + routes**

---

## License

This project is licensed under the [MIT License](LICENSE).  
© 2025 Andre Carlo Demonteverde