# 🚀 TaskFlow — Django + React + MongoDB Task Manager

A full-stack task manager using **two databases**:
- **SQLite** (via Django ORM) — for user authentication
- **MongoDB** (via PyMongo) — for tasks + activity logs

## Tech Stack
**Backend:** Python, Django, Django REST Framework, JWT, PyMongo, MongoDB, SQLite
**Frontend:** React, Bootstrap, Axios, HTML, CSS, JavaScript

## Features
- Register / Login (JWT)
- Create, Read, Update, Delete tasks
- Filter: All / Pending / Completed
- Activity log (stored in MongoDB)
- Responsive UI

## Why both DBs?
- **SQLite** handles Django's built-in user authentication perfectly.
- **MongoDB** handles the tasks and activity logs because they have a flexible schema (easy to add tags, subtasks later without migrations).

## Setup
### 1. Start MongoDB
Make sure MongoDB is running on `localhost:27017`

### 2. Backend
```bash
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
