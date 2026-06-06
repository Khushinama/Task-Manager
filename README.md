# TaskFlow - Premium Task Management System

TaskFlow is a professional, full-stack Task Management application built using the MERN stack (MongoDB, Express, React, Node.js). It features a sleek, high-contrast UI inspired by modern SaaS applications, complete with drag-and-drop Kanban boards, real-time filtering, and secure authentication.

## Features

- **Secure Authentication**: JWT-based login and registration system.
- **Modern Dashboard**: A beautiful, responsive dashboard with a clean, FinTrack-inspired aesthetic.
- **Kanban Board**: Fully interactive drag-and-drop Kanban view using `@hello-pangea/dnd`.
- **Advanced Task Management**: Create, edit, delete, and categorize tasks with priority levels (High, Medium, Low).
- **Smart Sorting**: Backend aggregation pipelines automatically surface high-priority tasks to the top.
- **Custom UI Components**: Built from scratch using Tailwind CSS and Framer Motion for buttery smooth animations.
- **API Documentation**: Integrated Swagger UI documentation.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Framer Motion, Axios, React Hot Toast, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), Bcrypt.

## Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB instance (local or Atlas)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the backend directory with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server: `node server.js or nodemon server.js`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the frontend directory with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the client: `npm run dev`

## API Documentation
Once the backend server is running, you can access the Swagger API documentation at:
`http://localhost:5000/api-docs`

## License
MIT
