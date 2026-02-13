# IEEE Event Management System

Full-stack event management system with separate backend and frontend.

## 🚀 Quick Start

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup database
mysql -u root -p < database/schema.sql

# Start backend server
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
# Install dependencies (from root)
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 📁 Project Structure

```
ieee/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── models/         # TypeScript types
│   │   ├── services/       # Business logic
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Entry point
│   ├── database/           # SQL schema
│   └── package.json
│
├── src/                    # Next.js Frontend
│   ├── app/               # Pages & routes
│   ├── components/        # React components
│   │   └── examples/      # API usage examples
│   └── lib/
│       └── api/           # API client & hooks
│           ├── eventAPI.ts    # API client
│           ├── hooks.ts       # React hooks
│           └── types.ts       # TypeScript types
│
└── package.json
```

## 🔌 API Usage in Frontend

### Using Hooks (Recommended)

```tsx
import { useEvents, useEventStats } from '@/lib/api/hooks';
import { EventStatus } from '@/lib/api/types';

function MyComponent() {
  // Get all events
  const { events, loading, error } = useEvents();
  
  // Get only LIVE events
  const { events: liveEvents } = useEvents(EventStatus.LIVE);
  
  // Get statistics
  const { stats } = useEventStats();
  
  return (
    <div>
      <p>Total Events: {stats.total}</p>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <span>{event.status}</span>
        </div>
      ))}
    </div>
  );
}
```

### Using API Client Directly

```tsx
import { eventAPI } from '@/lib/api/eventAPI';

// Create event
const id = await eventAPI.createEvent({
  title: 'New Event',
  start_time: '2026-03-20T10:00:00',
  end_time: '2026-03-20T18:00:00',
});

// Update event
await eventAPI.updateEvent(id, { title: 'Updated Event' });

// Delete event
await eventAPI.deleteEvent(id);
```

## 📡 API Endpoints

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/stats` - Get statistics
- `GET /health` - Health check

## 🎯 Event Status Logic

Status computed dynamically, NOT stored in DB:
- **UPCOMING**: before start_time
- **LIVE**: between start_time and end_time
- **PAST**: after end_time

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- MySQL
- express-validator

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- TailwindCSS

## 📖 Documentation

- Backend API: See [backend/README.md](backend/README.md)
- Example components: [src/components/examples/EventsList.tsx](src/components/examples/EventsList.tsx)
