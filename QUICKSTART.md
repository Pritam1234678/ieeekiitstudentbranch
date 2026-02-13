# 🚀 Quick Start Guide

## 1. Backend Setup

```bash
# Go to backend folder
cd backend

# Install dependencies
npm install

# Start MySQL and create database
mysql -u root -p

# In MySQL:
CREATE DATABASE ieee_events;
exit;

# Import schema
mysql -u root -p ieee_events < database/schema.sql

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

## 2. Frontend Setup

```bash
# Go back to root
cd ..

# Make sure .env.local exists with:
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start frontend
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 3. Test the API

Open browser: http://localhost:3000/events

You should see events loaded from the backend!

## API Endpoints Available:

- `GET http://localhost:5000/api/events` - All events
- `GET http://localhost:5000/api/events?status=LIVE` - Live events only
- `GET http://localhost:5000/api/events?status=UPCOMING` - Upcoming events
- `GET http://localhost:5000/api/events?status=PAST` - Past events
- `GET http://localhost:5000/api/events/stats` - Statistics
- `GET http://localhost:5000/health` - Health check

## Troubleshooting:

### Backend not connecting to DB?
1. Check MySQL is running
2. Check credentials in `backend/.env`
3. Make sure database `ieee_events` exists

### Frontend shows error?
1. Make sure backend is running on port 5000
2. Check `.env.local` has correct API URL
3. Check browser console for errors

### CORS errors?
Backend already has CORS enabled for `http://localhost:3000`. If you change ports, update `backend/src/server.ts`.
