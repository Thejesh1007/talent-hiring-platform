# Talent Hiring Platform

A full-stack Talent Hiring Platform built using React, Node.js, Express, Prisma, and PostgreSQL.

---

## 📌 Overview

This platform enables:

- Candidates to browse available jobs and apply
- Recruiters to create, edit, and manage job postings
- Admin to monitor users, jobs, and applications

The system uses JWT-based authentication and role-based access control (RBAC).

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Context API
- Axios
- Modern SaaS Dark UI Design

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (Hosted on Render)

### Authentication & Security
- JWT Authentication
- Role-Based Access Control (RBAC)
- Helmet for HTTP security headers
- Express Rate Limiting

---

## 🚀 Features

### 🔐 Authentication
- Signup (Candidate / Recruiter)
- Login with JWT token generation
- Protected routes
- Role-based access restrictions

### 👤 Candidate Features
- View all available jobs
- Apply to jobs
- View application history dashboard

### 🏢 Recruiter Features
- Create new job postings
- Edit existing job postings
- Delete job postings
- View all posted jobs

### 🛡 Admin Features
- View all users
- View all jobs
- View all applications
- Delete users or jobs

---

## 🗂 Project Structure

```
client/        → React Frontend
server/        → Express Backend
prisma/        → Database Schema & Migrations
```

---

## ⚙ Environment Variables (Backend)

Create a `.env` file inside the `server/` directory:

```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secure_secret
PORT=5000
```

---

## 💻 Running the Project Locally

### Backend

```
cd server
npm install
npm run dev
```

### Frontend

```
cd client
npm install
npm run dev
```

---

## 🧠 Architecture

Client (React)  
⬇  
Express API  
⬇  
Prisma ORM  
⬇  
PostgreSQL Database  

JWT is used for authentication, and RBAC middleware enforces role-based access control.

---

## 📚 Academic Context

This project is developed as a full-stack system design project demonstrating:

- Authentication flow implementation
- Secure API development
- Role-based authorization
- Full CRUD operations
- Modern frontend UI architecture
