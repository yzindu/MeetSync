# MeetSync — Weekly Report Management System

> A full-stack web application for managing team weekly progress reports with role-based access control (RBAC), interactive dashboards, and an AI-powered chat assistant.

---

## Table of Contents

- [Overview](#overview)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
---

## Overview

MeetSync streamlines how teams track and report weekly progress. Team **Members** submit structured weekly reports linked to projects. **Managers** review all reports across the team, monitor KPI dashboards with charts, manage projects, and query team data.

---

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/MeetSync.git
cd MeetSync
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Rename the file named `.env.example` to `.env` inside `backend/`: 

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWToken=jwt_key
```

**Start the backend:**
```bash
npm run dev      # Development (auto restart with nodemon)
npm start        # Production
```

API runs at: **http://localhost:5000**

**Verify it's working:**
```bash
curl http://localhost:5000/api/health
# Expected: {"message":"Weekly Report API is up and running!"}
```

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

App opens at: **http://localhost:5173**

---

## Running the Application

Run both servers simultaneously in separate terminals:

| Terminal | Directory | Command | URL |
|---|---|---|---|
| **Backend** | `MeetSync/backend` | `npm run dev` | http://localhost:5000 |
| **Frontend** | `MeetSync/frontend` | `npm run dev` | http://localhost:5173 |

Open **http://localhost:5173** in your browser.

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | >= 18.x | Runtime |
| Express.js | ^5.2.1 | REST API framework |
| MongoDB | Atlas / Local | Database |
| Mongoose | ^9.7.4 | ODM / Schema modeling |
| bcryptjs | ^3.0.3 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| dotenv | ^17.4.2 | Environment variable management |
| cors | ^2.8.6 | Cross-origin resource sharing |
| nodemon | ^3.1.14 | Dev auto-restart |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.7 | UI library |
| Vite | ^8.1.1 | Build tool and dev server |
| React Router DOM | ^7.18.1 | Client-side routing |
| Tailwind CSS | ^4.3.2 | Utility-first styling |
| shadcn/ui | ^4.13.0 | Accessible UI components |
| Recharts | ^3.9.2 | Data visualization charts |
| Axios | ^1.18.1 | HTTP client |
| Lucide React | ^1.23.0 | Icon library |
| date-fns | ^4.4.0 | Date formatting utilities |
| Sonner | ^2.0.7 | Toast notifications |

---

## Features

### Member Role
- Register and login with JWT authentication
- Submit weekly reports (tasks completed, tasks planned, blockers, hours worked, notes)
- Save reports as **Draft (Pending)** or **Submit** them
- View personal report history with status tracking
- Browse available projects

### Manager Role
- Full dashboard with KPI cards (total reports, submission rate, average hours, active projects)
- Charts: Submission Compliance (Pie), Tasks Completed Trend (Line), Workload by Project (Bar)
- Team submission status table (one row per member)
- View and filter all team reports
- Full Project CRUD (Create, Read, Update, soft-Delete)

### Security
- JWT-based stateless authentication
- Role-based route protection (Member / Manager)
- Protected frontend routes with automatic role-based redirects

---

## Project Structure

```
MeetSync/
├── backend/                    # Express.js REST API
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── weeklyReportController.js
│   │   ├── projectController.js
│   │   ├── userController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect
│   ├── models/
│   │   ├── User.js
│   │   ├── Report.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── userRoutes.js
│   │   └── aiRoutes.js
│   ├── .env                    # Environment variables (not committed)
|   ├── .env.example            # Environment variables example file
│   ├── server.js
│   └── package.json
│
└── frontend/                   # React + Vite SPA
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   └── ChatWidget.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── layouts/
    │   │   ├── MemberLayout.jsx
    │   │   └── ManagerLayout.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── member/
    │   │   │   ├── Reports.jsx
    │   │   │   ├── WeeklyReport.jsx
    │   │   │   ├── ReportHistory.jsx
    │   │   │   └── ProjectsPage.jsx
    │   │   └── manager/
    │   │       ├── ManagerDashboard.jsx
    │   │       ├── TeamReports.jsx
    │   │       └── ProjectsManager.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---