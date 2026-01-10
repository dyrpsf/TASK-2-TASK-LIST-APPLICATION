# Task List Application – Android Club VIT Bhopal (Task 2)

A simple full-stack task list application with a Node.js backend and a vanilla HTML/CSS/JS frontend.

## Features

- Add new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as complete / incomplete
- Filter by: All, Pending, Completed
- Responsive UI with toasts and loading indicator
- Data persisted in a local JSON file (`tasks-db.json`)

## Tech Stack

- Backend: Node.js (built-in `http`, `fs`, `path`)
- Frontend: HTML, CSS, Vanilla JavaScript
- Storage: JSON file acting as a simple database

## Setup Instructions

1. Install [Node.js](https://nodejs.org) (v14+ recommended).
2. Clone this repository or download the source.
3. In the project folder, run:

   ```bash
   node task-app.js

   Open your browser at:

text

http://localhost:3000
The server will automatically create tasks-db.json on first run if it does not exist.

API Endpoints
See API.md for detailed endpoint documentation.

text


### `API.md`

# Task List API Documentation

Base URL: `http://localhost:3000`

## Get all tasks

**GET** `/api/tasks`

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Example task",
      "description": "Optional description",
      "completed": false,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

# Create a task
# POST /api/tasks

Body

```JSON

{
  "title": "Finish Android Club assignment",
  "description": "Implement task list with CRUD and API"
}
```
# Responses

201 Created – success, returns updated list
400 Bad Request – if title is missing/empty
# Update a task
# PUT /api/tasks/:id

# You can update any subset of fields.

# Body examples

# Change title/description:
```# JSON

{
  "title": "Updated title",
  "description": "Updated description"
}
```
# Toggle completion:
```# JSON

{
  "completed": true
}
```
# Responses

200 OK – success, returns updated list
400 Bad Request – invalid data (e.g. empty title)
404 Not Found – task with given id does not exist
Delete a task
DELETE /api/tasks/:id

Responses

200 OK – success, returns updated list
404 Not Found – task with given id does not exist
text


---

## 5. Summary

- The `task-app.js` you already have **does implement all core and technical requirements** from the screenshot:
  - Full CRUD, REST API, persistence, responsive UI, visual feedback, and basic error handling.
- To fully match the **submission guidelines**, you still need:
  - A README with setup instructions (template provided).
  - Simple API documentation (template provided).
  - Screenshots of the UI (you’ll take these yourself and add to the repo).
