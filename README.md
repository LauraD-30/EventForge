# EventForge
Event management platform for CST project.

## Structure
-- backend: server-side logic
-- frontend: web interface
-- docs: project documents

## Team Members
--Kiishi Haastrup ( Scrum Master )
--Laura Duterval  ( Product Owner )
--Kevin Montoya  ( Developer )
--Souber Abdourahman ( Developer )

## Auth API (contract)
POST /api/auth/register  { email, password, role: ADMIN|ORGANIZER|GUEST }
→ 201 { data: { id, email, role, token } } | 409 { error }
POST /api/auth/login     { email, password }
→ 200 { data: { id, email, role, token } } | 401 { error }
GET  /api/auth/me        (Authorization: Bearer <token>)
→ 200 { data: { id, email, role } } | 401 { error }

## Errors
Validation → { "error": "ValidationError", "details":[{ "path","message" }] }
Not found → { "error": "Not Found", "path": "/bad" }
Other     → { "error": "message" }


1. How to Run the Project
Clone
git clone <REPO_URL>
cd EventForge

2. Backend Setup
cd backend
npm install
npm run dev


Backend runs at: http://localhost:3001

3. Frontend Setup

Open a new terminal:

cd event-forge-app
npm install
npm run dev


Frontend runs at: http://localhost:5173

A proxy in vite.config.js forwards /api/* to the backend.

4. Login Accounts for Testing
Guest Account

Email: alice@example.com

Password: secret12

Organizer Account

Email: organizer@example.com

Password: secret12

These users are preloaded by the backend.

5. Demo Instructions (For Instructor)
Guest Login

Go to: http://localhost:5173

Login with alice@example.com / secret12

Expected:

Redirect to /guest-dashboard

Guest welcome message

“Browse Events” button

Click Browse Events

Shows events loaded from backend API
(Tech Summit, Music Fest, Startup Night)

Organizer Login

Log out

Login with organizer@example.com / secret12

Expected:

Redirect to /organizer-dashboard

Event drafts

Posted events section

Quick stats

Protected Routes

If not logged in:

/guest-dashboard → redirects to login

/organizer-dashboard → redirects to login

/browse-events → redirects to login

JWT persists using localStorage.

6. Project Structure
EventForge/
│── backend/
│   ├── src/
│   │   ├── routes/auth.js
│   │   ├── routes/events.js
│   │   ├── middleware/requireAuth.js
│   │   ├── data/events.json
│   │   └── users.memory.js
│   └── package.json
│
└── event-forge-app/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/UserContext.jsx
    │   └── App.jsx
    └── vite.config.js

7. Notes

No database is required; all data is stored in memory/JSON files.

Backend must be running for login + events to work.

Frontend and backend must each run in separate terminals.
