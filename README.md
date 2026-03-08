# 🐾 PurrPaws

PurrPaws is a full-stack web application built using React and Express. It aims to address the issue regarding stray animals in the country by streamlining the adoption process.

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM

**Backend:**
- Node.js
- Express
- Nodemon (Development)

**Database:**
- MongoDB (Mongoose)

---

## 📁 Project Structure

This repository is set up as a monorepo. We use `concurrently` to run both the frontend and backend from the root folder.

```text
cbsweg1-purrpaws/
│
├── client/          # React frontend (Vite)
├── server/          # Express REST API (Node.js)
├── package.json     # Master config (Runs both servers concurrently)
└── README.md