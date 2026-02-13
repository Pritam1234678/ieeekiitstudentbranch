# IEEE Event Management System - Backend API

Node.js/Express backend with TypeScript, MySQL, and RESTful API design.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure database in `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ieee_events
```

3. Setup database:
```bash
mysql -u root -p < database/schema.sql
```

4. Start server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

Base URL: `http://localhost:5000`

- `GET /api/events` - Get all events (query: ?status=LIVE/UPCOMING/PAST, &limit=10, &offset=0)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/stats` - Get statistics
- `GET /health` - Health check

## Event Status Logic

Status is computed dynamically:
- **UPCOMING**: current_time < start_time
- **LIVE**: current_time between start_time and end_time
- **PAST**: current_time > end_time

Status is NOT stored in database.

## Tech Stack

- Node.js + Express
- TypeScript
- MySQL with connection pooling
- express-validator for validation
- CORS enabled for frontend
