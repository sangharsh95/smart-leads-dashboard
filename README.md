# Smart Leads Dashboard (MERN Stack)

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) + TypeScript and TailwindCSS.

## Features

- **Authentication**: JWT-based secure authentication with Role-Based Access Control (Admin, Sales User).
- **Leads Management**: Full CRUD operations for leads.
- **Advanced Filtering & Search**: Debounced search by Name/Email, multi-field filtering by Status and Source.
- **Server-Side Pagination**: Efficient data loading with 10 records per page.
- **CSV Export**: Export currently filtered leads to CSV.
- **Premium UI**: Responsive, modern design with TailwindCSS, featuring light and dark mode support.
- **Docker Ready**: Complete Docker setup with `docker-compose`.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, React Hook Form, Zod, React Router DOM, Axios, date-fns, Lucide React.
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, json2csv.

## Setup Instructions

### Option 1: Using Docker (Recommended)

Make sure you have Docker and Docker Compose installed.

1. Clone the repository.
2. Run the application:
   ```bash
   docker-compose up --build
   ```
3. Access the Frontend at `http://localhost:80`
4. Backend API runs on `http://localhost:5000`

### Option 2: Manual Setup

#### Prerequisites
- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas URI

#### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set your variables.
4. `npm run dev`

#### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Access `http://localhost:5173`

## API Documentation

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/leads` - Get paginated/filtered leads
- `POST /api/leads` - Create a lead
- `GET /api/leads/:id` - Get a specific lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead
- `GET /api/leads/export` - Download CSV of filtered leads
