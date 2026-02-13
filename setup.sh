#!/bin/bash

echo "🚀 Setting up IEEE Event Management System..."

# Setup Backend
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo ""
echo "🗄️  Database setup required!"
echo "Run: mysql -u root -p < database/schema.sql"

cd ..

# Setup Frontend
echo ""
echo "📦 Installing frontend dependencies..."
npm install

# Create .env.local
echo ""
echo "⚙️  Creating environment file..."
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Setup database: cd backend && mysql -u root -p < database/schema.sql"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: npm run dev"
echo ""
