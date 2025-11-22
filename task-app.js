// task-app.js
// Simple full-stack Task List Application in ONE file.
// Backend: Node.js (built-in http + fs, JSON file as DB)
// Frontend: HTML/CSS/JS served from this same file.

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'tasks-db.json');

// ---------- HTML (frontend) ----------
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Task List Application</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: radial-gradient(circle at top left, #22c55e33, #0f172a 45%, #020617 100%);
      color: #e5e7eb;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .app {
      background: rgba(15, 23, 42, 0.96);
      border-radius: 16px;
      width: 100%;
      max-width: 900px;
      box-shadow: 0 18px 40px rgba(0,0,0,0.6);
      border: 1px solid rgba(148, 163, 184, 0.3);
      overflow: hidden;
    }
    header {
      padding: 18px 24px;
      border-bottom: 1px solid rgba(51, 65, 85, 0.9);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: radial-gradient(circle at top, #22c55e25, transparent 55%);
    }
    header h1 {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.02em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    header h1 span {
      display: inline-flex;
      width: 22px;
      height: 22px;
      border-radius: 999px;
      background: #22c55e33;
      align-items: center;
      justify-content: center;
      color: #22c55e;
      font-size: 14px;
    }
    header small {
      color: #9ca3af;
      font-size: 12px;
    }
    main {
      padding: 20px 24px 22px 24px;
    }
    .top-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 18px;
    }
    .card {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(51, 65, 85, 0.9);
      border-radius: 12px;
      padding: 12px 14px;
    }
    .card.form-card {
      flex: 3 1 240px;
    }
    .card.summary-card {
      flex: 1.2 1 140px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
    }
    label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #9ca3af;
      margin-bottom: 4px;
    }
    input[type="text"], textarea {
      width: 100%;
      border-radius: 8px;
      border: 1px solid rgba(55, 65, 81, 0.9);
      background: rgba(15, 23, 42, 0.95);
      color: #e5e7eb;
      padding: 7px 9px;
      font-size: 13px;
      outline: none;
      transition: border 0.14s ease, box-shadow 0.14s ease, background 0.14s ease;
    }
    input[type="text"]:focus,
    textarea:focus {
      border-color: #22c55e;
      box-shadow: 0 0 0 1px #22c55e55;
      background: rgba(15, 23, 42, 1);
    }
    textarea {
      resize: vertical;
      min-height: 52px;
      max-height: 120px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 2fr 3fr auto;
      gap: 8px;
      align-items: flex-end;
    }
    .btn {
      border: none;
      border-radius: 999px;
      padding: 7px 14px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: background 0.14s ease, transform 0.06s ease, box-shadow 0.14s ease, opacity 0.14s ease;
      white-space: nowrap;
    }
    .btn-primary {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: #022c22;
      box-shadow: 0 10px 22px rgba(34, 197, 94, 0.4);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #22c55e, #15803d);
      transform: translateY(-1px);
      box-shadow: 0 15px 28px rgba(34, 197, 94, 0.5);
    }
    .btn-primary:active {
      transform: translateY(0);
      box-shadow: 0 6px 14px rgba(34, 197, 94, 0.35);
    }
    .btn-ghost {
      background: transparent;
      color: #9ca3af;
      padding-inline: 9px;
    }
    .btn-ghost:hover {
      background: rgba(31, 41, 55, 0.9);
      color: #e5e7eb;
    }
    .btn-small {
      padding-inline: 8px;
      padding-block: 4px;
      font-size: 12px;
    }
    .btn-danger {
      background: rgba(248, 113, 113, 0.16);
      color: #fecaca;
    }
    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.35);
    }
    .btn-outline {
      border-radius: 999px;
      border: 1px solid rgba(55, 65, 81, 0.9);
      background: rgba(15, 23, 42, 0.9);
      color: #e5e7eb;
      padding: 3px 9px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .btn-outline.active {
      border-color: #22c55e;
      background: rgba(34, 197, 94, 0.16);
      color: #bbf7d0;
    }
    .summary-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #9ca3af;
    }
    .summary-value {
      font-size: 18px;
      font-weight: 600;
      color: #e5e7eb;
    }
    .summary-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      margin-right: 4px;
      display: inline-block;
    }
    .summary-dot.total { background: #22c55e; }
    .summary-dot.active { background: #facc15; }
    .summary-dot.done { background: #6366f1; }
    .summary-footer {
      font-size: 11px;
      color: #6b7280;
      margin-top: 6px;
    }
    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 4px 0 10px 0;
      gap: 8px;
      flex-wrap: wrap;
    }
    .filter-group {
      display: inline-flex;
      gap: 4px;
      padding: 4px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(31, 41, 55, 0.9);
    }
    .filter-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #6b7280;
    }
    .task-list {
      margin-top: 6px;
      max-height: 430px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .task-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 9px 10px;
      border-radius: 10px;
      border: 1px solid rgba(31, 41, 55, 0.9);
      background: rgba(15, 23, 42, 0.9);
      margin-bottom: 6px;
      gap: 8px;
      transition: background 0.14s ease, border 0.14s ease, transform 0.06s ease, box-shadow 0.14s ease;
    }
    .task-item:hover {
      border-color: rgba(55, 65, 81, 1);
      background: rgba(15, 23, 42, 1);
      box-shadow: 0 10px 18px rgba(0,0,0,0.5);
      transform: translateY(-1px);
    }
    .task-left {
      display: flex;
      gap: 9px;
      flex: 1 1 auto;
    }
    .task-check {
      margin-top: 4px;
    }
    .task-check input {
      width: 16px;
      height: 16px;
      border-radius: 6px;
      accent-color: #22c55e;
      cursor: pointer;
    }
    .task-main {
      flex: 1 1 auto;
      min-width: 0;
    }
    .task-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 2px;
      word-break: break-word;
    }
    .task-title.completed {
      text-decoration: line-through;
      color: #6b7280;
    }
    .task-desc {
      font-size: 12px;
      color: #9ca3af;
      word-break: break-word;
    }
    .task-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
      font-size: 11px;
      color: #6b7280;
    }
    .task-pill {
      border-radius: 999px;
      padding: 2px 7px;
      border: 1px solid rgba(31, 41, 55, 1);
      background: rgba(15, 23, 42, 0.95);
    }
    .task-pill.done {
      border-color: rgba(79, 70, 229, 0.6);
      color: #c7d2fe;
    }
    .task-pill.pending {
      border-color: rgba(234, 179, 8, 0.6);
      color: #fef9c3;
    }
    .task-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      margin-left: 4px;
    }
    .task-empty {
      border-radius: 12px;
      border: 1px dashed rgba(55, 65, 81, 0.9);
      padding: 18px 14px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      background: rgba(15, 23, 42, 0.8);
      margin-top: 8px;
    }
    .task-empty strong {
      color: #e5e7eb;
      font-weight: 500;
    }
    .badge {
      font-size: 11px;
      border-radius: 999px;
      padding: 2px 7px;
      background: rgba(15, 23, 42, 1);
      border: 1px solid rgba(55, 65, 81, 0.9);
      color: #9ca3af;
    }
    .badge.success {
      border-color: rgba(34, 197, 94, 0.7);
      color: #bbf7d0;
    }
    .badge.info {
      border-color: rgba(59, 130, 246, 0.7);
      color: #bfdbfe;
    }
    .toast {
      position: fixed;
      bottom: 18px;
      right: 18px;
      max-width: 280px;
      background: rgba(15, 23, 42, 0.97);
      border-radius: 10px;
      padding: 9px 12px;
      font-size: 13px;
      border: 1px solid rgba(55, 65, 81, 1);
      display: none;
      box-shadow: 0 12px 26px rgba(0,0,0,0.7);
      z-index: 50;
    }
    .toast-success { border-color: rgba(34, 197, 94, 0.7); }
    .toast-error { border-color: rgba(239, 68, 68, 0.7); }
    .toast-title {
      font-weight: 600;
      margin-bottom: 2px;
      font-size: 12px;
    }
    .toast-msg { font-size: 12px; color: #e5e7eb; }
    .loading-bar {
      height: 2px;
      width: 100%;
      background: transparent;
      overflow: hidden;
      margin-top: 2px;
    }
    .loading-bar-inner {
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, #22c55e, #4ade80);
      animation: loading-bar 1s linear infinite;
      transform-origin: left;
    }
    .loading-hidden { display: none; }
    @keyframes loading-bar {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(30%); }
      100% { transform: translateX(120%); }
    }
    @media (max-width: 720px) {
      main { padding: 16px 14px 18px 14px; }
      header { padding: 14px; }
      .top-row { flex-direction: column; }
      .task-right { flex-direction: row; align-items: center; }
    }
  </style>
</head>
<body>
  <div class="app">
    <header>
      <div>
        <h1><span>✓</span> Task List Application</h1>
        <small>Android Club VIT Bhopal &middot; Full Stack Task</small>
      </div>
      <div class="badge info">Local JSON API &middot; Node.js</div>
    </header>

    <div class="loading-bar" id="loadingBar">
      <div class="loading-bar-inner" id="loadingBarInner"></div>
    </div>

    <main>
      <div class="top-row">
        <div class="card form-card">
          <form id="taskForm">
            <div class="form-grid">
              <div>
                <label for="title">Task title</label>
                <input id="title" type="text" placeholder="e.g. Finish Android Club assignment" required />
              </div>
              <div>
                <label for="description">Description (optional)</label>
                <textarea id="description" placeholder="Add details: links, notes, subtasks..."></textarea>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px;">
                <button type="submit" class="btn btn-primary">
                  <span>＋</span>
                  <span id="submitLabel">Add task</span>
                </button>
                <button type="button" class="btn btn-ghost btn-small" id="clearFormBtn">Clear</button>
              </div>
            </div>
          </form>
        </div>

        <div class="card summary-card">
          <div class="summary-row">
            <span><span class="summary-dot total"></span>Total</span>
            <span class="summary-value" id="summaryTotal">0</span>
          </div>
          <div class="summary-row">
            <span><span class="summary-dot active"></span>Pending</span>
            <span class="summary-value" id="summaryActive">0</span>
          </div>
          <div class="summary-row">
            <span><span class="summary-dot done"></span>Completed</span>
            <span class="summary-value" id="summaryDone">0</span>
          </div>
          <div class="summary-footer">
            Data is stored in a local JSON file (<code>tasks-db.json</code>).
            Restarting the server keeps your tasks.
          </div>
        </div>
      </div>

      <div class="filter-bar">
        <div>
          <span class="filter-label">View</span>
        </div>
        <div class="filter-group">
          <button type="button" class="btn-outline active" data-filter="all">All</button>
          <button type="button" class="btn-outline" data-filter="active">Pending</button>
          <button type="button" class="btn-outline" data-filter="completed">Completed</button>
        </div>
      </div>

      <div class="task-list" id="taskList"></div>
    </main>
  </div>

  <div class="toast" id="toast">
    <div class="toast-title" id="toastTitle"></div>
    <div class="toast-msg" id="toastMsg"></div>
  </div>

  <script>
    (function () {
      var tasks = [];
      var currentFilter = "all";
      var editingTaskId = null;

      var taskForm = document.getElementById("taskForm");
      var titleInput = document.getElementById("title");
      var descInput = document.getElementById("description");
      var taskListEl = document.getElementById("taskList");
      var submitLabel = document.getElementById("submitLabel");
      var clearFormBtn = document.getElementById("clearFormBtn");
      var filterButtons = document.querySelectorAll("[data-filter]");
      var summaryTotal = document.getElementById("summaryTotal");
      var summaryActive = document.getElementById("summaryActive");
      var summaryDone = document.getElementById("summaryDone");
      var toastEl = document.getElementById("toast");
      var toastTitle = document.getElementById("toastTitle");
      var toastMsg = document.getElementById("toastMsg");
      var loadingBar = document.getElementById("loadingBar");
      var loadingBarInner = document.getElementById("loadingBarInner");

      var toastTimeout = null;

      function setLoading(isLoading) {
        if (isLoading) {
          loadingBar.classList.remove("loading-hidden");
          loadingBarInner.style.animationPlayState = "running";
        } else {
          loadingBar.classList.add("loading-hidden");
          loadingBarInner.style.animationPlayState = "paused";
        }
      }

      function escapeHtml(str) {
        if (!str) return "";
        return String(str).replace(/[&<>"']/g, function (ch) {
          return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
          }[ch];
        });
      }

      function showToast(message, type) {
        if (toastTimeout) {
          clearTimeout(toastTimeout);
        }
        toastEl.className = "toast";
        if (type === "success") {
          toastEl.classList.add("toast-success");
          toastTitle.textContent = "Success";
        } else if (type === "error") {
          toastEl.classList.add("toast-error");
          toastTitle.textContent = "Error";
        } else {
          toastTitle.textContent = "Info";
        }
        toastMsg.textContent = message;
        toastEl.style.display = "block";
        toastTimeout = setTimeout(function () {
          toastEl.style.display = "none";
        }, 3000);
      }

      function fetchJson(url, options) {
        options = options || {};
        options.headers = options.headers || {};
        if (options.body && typeof options.body !== "string") {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(options.body);
        }
        return fetch(url, options).then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok || data.success === false) {
              var err = new Error(data.message || "Request failed");
              err.data = data;
              throw err;
            }
            return data;
          });
        });
      }

      function refreshSummary() {
        var total = tasks.length;
        var done = 0;
        for (var i = 0; i < tasks.length; i++) {
          if (tasks[i].completed) done++;
        }
        var active = total - done;
        summaryTotal.textContent = total;
        summaryActive.textContent = active;
        summaryDone.textContent = done;
      }

      function renderTasks() {
        refreshSummary();

        var filtered = [];
        for (var i = 0; i < tasks.length; i++) {
          var t = tasks[i];
          if (currentFilter === "active" && t.completed) continue;
          if (currentFilter === "completed" && !t.completed) continue;
          filtered.push(t);
        }

        if (!filtered.length) {
          taskListEl.innerHTML =
            '<div class="task-empty">' +
            '<strong>No tasks</strong> in this view yet. Add one using the form above.' +
            "</div>";
          return;
        }

        taskListEl.innerHTML = "";
        for (var j = 0; j < filtered.length; j++) {
          var task = filtered[j];
          var item = document.createElement("div");
          item.className = "task-item";

          var statusClass = task.completed ? "done" : "pending";
          var statusText = task.completed ? "Completed" : "Pending";

          var created = new Date(task.createdAt || task.updatedAt || Date.now());
          var createdStr =
            created.toLocaleDateString() + " · " + created.toLocaleTimeString();

          var titleClass = "task-title" + (task.completed ? " completed" : "");

          var html =
            '<div class="task-left">' +
            '<div class="task-check">' +
            '<input type="checkbox" ' +
            (task.completed ? "checked" : "") +
            ' data-id="' +
            task.id +
            '" class="task-toggle" />' +
            "</div>" +
            '<div class="task-main">' +
            '<div class="' +
            titleClass +
            '">' +
            escapeHtml(task.title) +
            "</div>";

          if (task.description) {
            html +=
              '<div class="task-desc">' +
              escapeHtml(task.description) +
              "</div>";
          }

          html +=
            '<div class="task-meta">' +
            '<span class="task-pill ' +
            statusClass +
            '">' +
            statusText +
            "</span>" +
            '<span class="task-pill">Created: ' +
            escapeHtml(createdStr) +
            "</span>" +
            "</div>" +
            "</div></div>";

          html +=
            '<div class="task-right">' +
            '<button class="btn btn-small btn-ghost edit-btn" data-id="' +
            task.id +
            '">Edit</button>' +
            '<button class="btn btn-small btn-danger delete-btn" data-id="' +
            task.id +
            '">Delete</button>' +
            "</div>";

          item.innerHTML = html;
          taskListEl.appendChild(item);
        }

        var toggles = taskListEl.querySelectorAll(".task-toggle");
        for (var k = 0; k < toggles.length; k++) {
          toggles[k].addEventListener("change", function (e) {
            var id = parseInt(e.target.getAttribute("data-id"), 10);
            toggleTask(id, e.target.checked);
          });
        }

        var editButtons = taskListEl.querySelectorAll(".edit-btn");
        for (var m = 0; m < editButtons.length; m++) {
          editButtons[m].addEventListener("click", function (e) {
            var id = parseInt(e.target.getAttribute("data-id"), 10);
            startEdit(id);
          });
        }

        var deleteButtons = taskListEl.querySelectorAll(".delete-btn");
        for (var n = 0; n < deleteButtons.length; n++) {
          deleteButtons[n].addEventListener("click", function (e) {
            var id = parseInt(e.target.getAttribute("data-id"), 10);
            deleteTask(id);
          });
        }
      }

      function loadTasks() {
        setLoading(true);
        fetchJson("/api/tasks")
          .then(function (res) {
            tasks = res.data || [];
            renderTasks();
          })
          .catch(function () {
            showToast("Failed to load tasks from API.", "error");
          })
          .finally(function () {
            setLoading(false);
          });
      }

      function resetForm() {
        taskForm.reset();
        editingTaskId = null;
        submitLabel.textContent = "Add task";
      }

      function startEdit(id) {
        var t = null;
        for (var i = 0; i < tasks.length; i++) {
          if (tasks[i].id === id) {
            t = tasks[i];
            break;
          }
        }
        if (!t) return;
        editingTaskId = id;
        titleInput.value = t.title || "";
        descInput.value = t.description || "";
        submitLabel.textContent = "Save changes";
        titleInput.focus();
      }

      function toggleTask(id, completed) {
        setLoading(true);
        fetchJson("/api/tasks/" + id, {
          method: "PUT",
          body: { completed: completed }
        })
          .then(function (res) {
            tasks = res.data || tasks;
            renderTasks();
            showToast("Task updated.", "success");
          })
          .catch(function () {
            showToast("Could not update task.", "error");
          })
          .finally(function () {
            setLoading(false);
          });
      }

      function deleteTask(id) {
        if (!confirm("Delete this task permanently?")) return;
        setLoading(true);
        fetchJson("/api/tasks/" + id, { method: "DELETE" })
          .then(function (res) {
            tasks = res.data || tasks;
            renderTasks();
            showToast("Task deleted.", "success");
          })
          .catch(function () {
            showToast("Could not delete task.", "error");
          })
          .finally(function () {
            setLoading(false);
          });
      }

      taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var title = titleInput.value.trim();
        var description = descInput.value.trim();
        if (!title) {
          showToast("Title is required.", "error");
          titleInput.focus();
          return;
        }
        setLoading(true);

        if (editingTaskId !== null) {
          fetchJson("/api/tasks/" + editingTaskId, {
            method: "PUT",
            body: { title: title, description: description }
          })
            .then(function (res) {
              tasks = res.data || tasks;
              renderTasks();
              resetForm();
              showToast("Task updated successfully.", "success");
            })
            .catch(function () {
              showToast("Could not update task.", "error");
            })
            .finally(function () {
              setLoading(false);
            });
        } else {
          fetchJson("/api/tasks", {
            method: "POST",
            body: { title: title, description: description }
          })
            .then(function (res) {
              tasks = res.data || tasks;
              renderTasks();
              resetForm();
              showToast("Task added.", "success");
            })
            .catch(function () {
              showToast("Could not create task.", "error");
            })
            .finally(function () {
              setLoading(false);
            });
        }
      });

      clearFormBtn.addEventListener("click", function () {
        resetForm();
      });

      for (var i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener("click", function (e) {
          var filter = e.target.getAttribute("data-filter");
          currentFilter = filter;
          for (var j = 0; j < filterButtons.length; j++) {
            filterButtons[j].classList.remove("active");
          }
          e.target.classList.add("active");
          renderTasks();
        });
      }

      loadTasks();
    })();
  </script>
</body>
</html>`;

// ---------- Simple JSON "database" helpers ----------
function loadTasks() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf8') || '[]';
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error('Error reading DB file:', err);
    return [];
  }
}

function saveTasks(tasks) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(JSON.stringify(payload));
}

function collectRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) {
        req.socket.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

// ---------- HTTP server / API ----------
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  // Serve frontend
  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(INDEX_HTML);
    return;
  }

  // Ignore favicon
  if (req.method === 'GET' && pathname === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- REST API ---
  if (pathname === '/api/tasks' && req.method === 'GET') {
    const tasks = loadTasks();
    sendJson(res, 200, { success: true, data: tasks });
    return;
  }

  if (pathname === '/api/tasks' && req.method === 'POST') {
    try {
      const body = await collectRequestBody(req);
      const title = (body.title || '').trim();
      const description = (body.description || '').trim();

      if (!title) {
        sendJson(res, 400, { success: false, message: 'Title is required.' });
        return;
      }

      const tasks = loadTasks();
      const now = new Date().toISOString();
      const nextId = tasks.reduce((max, t) => Math.max(max, t.id || 0), 0) + 1;

      const newTask = {
        id: nextId,
        title,
        description,
        completed: false,
        createdAt: now,
        updatedAt: now
      };

      tasks.push(newTask);
      saveTasks(tasks);
      sendJson(res, 201, { success: true, data: tasks });
    } catch (err) {
      console.error(err);
      sendJson(res, 400, { success: false, message: err.message || 'Bad request' });
    }
    return;
  }

  // /api/tasks/:id
  const taskIdMatch = pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (taskIdMatch) {
    const id = parseInt(taskIdMatch[1], 10);
    const tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      sendJson(res, 404, { success: false, message: 'Task not found' });
      return;
    }

    if (req.method === 'PUT') {
      try {
        const body = await collectRequestBody(req);
        if (body.title !== undefined) {
          const title = String(body.title).trim();
          if (!title) {
            sendJson(res, 400, { success: false, message: 'Title cannot be empty.' });
            return;
          }
          tasks[index].title = title;
        }
        if (body.description !== undefined) {
          tasks[index].description = String(body.description).trim();
        }
        if (body.completed !== undefined) {
          tasks[index].completed = !!body.completed;
        }
        tasks[index].updatedAt = new Date().toISOString();
        saveTasks(tasks);
        sendJson(res, 200, { success: true, data: tasks });
      } catch (err) {
        console.error(err);
        sendJson(res, 400, { success: false, message: err.message || 'Bad request' });
      }
      return;
    }

    if (req.method === 'DELETE') {
      tasks.splice(index, 1);
      saveTasks(tasks);
      sendJson(res, 200, { success: true, data: tasks });
      return;
    }
  }

  // Not found
  sendJson(res, 404, { success: false, message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log('Task List app running on http://localhost:' + PORT);
});