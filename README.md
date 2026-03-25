# TaskFlow — Real-time Team Collaboration & Task Manager

**Register Number:** 24BIT0441  
**Name:** Rachana P  
**Course:** BITE304L — Web Technologies  
**Slot:** C1+TC1  

---

## 📁 Project Structure

```
taskflow/
├── frontend/               ← Open index.html to run the website
│   ├── index.html          ← ✅ CLICK THIS TO OPEN THE WEBSITE
│   ├── css/
│   │   └── style.css       ← All styles (CSS variables, animations, layout)
│   └── js/
│       ├── state.js        ← Global state & localStorage persistence
│       ├── auth.js         ← Login, Register, Logout logic
│       ├── projects.js     ← Project CRUD & sidebar rendering
│       ├── tasks.js        ← Task Add / Edit / Delete / Move
│       ├── board.js        ← Kanban board rendering & HTML templates
│       ├── drag.js         ← HTML5 Drag & Drop API
│       ├── ui.js           ← Toast notifications & keyboard shortcuts
│       └── app.js          ← App initialization & seed data
│
├── backend/                ← Node.js + Express REST API
│   ├── server.js           ← Main server entry point
│   ├── models/
│   │   ├── User.js         ← MongoDB User schema (bcrypt password hashing)
│   │   ├── Project.js      ← MongoDB Project schema
│   │   └── Task.js         ← MongoDB Task schema (business rule validation)
│   ├── routes/
│   │   ├── auth.js         ← POST /register, POST /login, POST /logout
│   │   ├── projects.js     ← GET/POST/PUT/DELETE /api/projects
│   │   └── tasks.js        ← GET/POST/PUT/DELETE /api/tasks
│   └── middleware/
│       └── authMiddleware.js ← Session-based route protection
│
├── package.json            ← Node.js dependencies
├── .env.example            ← Environment variable template
└── README.md               ← This file
```

---

## 🚀 How to Open the Website (No Installation Needed)

1. Extract the ZIP file
2. Open the `frontend/` folder
3. **Double-click `index.html`**
4. The website opens in your browser instantly ✅

> **Demo Login:** `demo@taskflow.com` / `demo123`

---

## ⚙️ Running the Full Backend (Optional)

The frontend works standalone. To enable full REST API + MongoDB:

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or a MongoDB Atlas URI

### Steps

```bash
# 1. Navigate to the project folder
cd taskflow

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and session secret

# 4. Start the server
npm start
# or for auto-reload during development:
npm run dev

# 5. Open in browser
http://localhost:5000
```

---

## 🔌 REST API Endpoints

| Method | Endpoint                   | Description              | Auth Required |
|--------|----------------------------|--------------------------|---------------|
| POST   | /api/auth/register         | Create new account       | No            |
| POST   | /api/auth/login            | Login                    | No            |
| POST   | /api/auth/logout           | Logout                   | No            |
| GET    | /api/auth/me               | Get current user         | Yes           |
| GET    | /api/projects              | List user's projects     | Yes           |
| POST   | /api/projects              | Create project           | Yes           |
| GET    | /api/projects/:id          | Get project details      | Yes           |
| PUT    | /api/projects/:id          | Update project           | Yes           |
| DELETE | /api/projects/:id          | Delete project + tasks   | Yes           |
| GET    | /api/projects/:id/tasks    | Get tasks for project    | Yes           |
| POST   | /api/tasks                 | Create task              | Yes           |
| GET    | /api/tasks/:id             | Get task                 | Yes           |
| PUT    | /api/tasks/:id             | Update task              | Yes           |
| DELETE | /api/tasks/:id             | Delete task              | Yes           |

---

## ✅ Features Implemented

| Feature              | Details                                                      |
|----------------------|--------------------------------------------------------------|
| Login / Register     | Email regex validation, password min-length, error messages  |
| Kanban Board         | To Do · In Progress · Done columns                           |
| Add Task             | Title, description, priority, assignee, due date, column     |
| Edit Task            | Full edit modal pre-filled with existing data                |
| Delete Task          | Confirmation prompt before deletion                          |
| Reorder / Move       | Drag & drop between columns + quick move buttons             |
| Business Rule        | Cannot mark "Done" without assignee + due date               |
| Multiple Projects    | Create, select, delete projects from sidebar                 |
| Persistent Storage   | All data saved in localStorage (frontend) / MongoDB (backend)|
| Toast Notifications  | Success and error feedback after every action                |
| Dark Theme           | Industrial dark aesthetic with CSS variables                 |
| Responsive Design    | Works on mobile, tablet, and desktop                         |
| Keyboard Shortcuts   | Escape closes modals, Enter submits forms                    |

---

## 📚 Course Modules Coverage

| Module | Topic                        | Implementation                              |
|--------|------------------------------|---------------------------------------------|
| 1      | HTML5, CSS3, Bootstrap       | Semantic HTML, CSS variables, responsive grid|
| 2      | JavaScript, DOM, Validation  | Form validation, regex, DOM manipulation    |
| 3      | SPA Concept                  | Single-page app with JS routing             |
| 4      | REST, AJAX, JSON             | Fetch API, RESTful routes, JSON responses   |
| 5      | Node.js, Express, Sessions   | Express server, session middleware          |
| 6      | MongoDB (NoSQL)              | Mongoose models, CRUD operations            |
| 7      | ReactJS (Component concept)  | Modular JS files acting as components       |

---

## 🛠 Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)  
**Backend:** Node.js, Express.js  
**Database:** MongoDB with Mongoose ODM  
**Auth:** Express-session + bcryptjs  
**Storage:** localStorage (frontend) / MongoDB (backend)
