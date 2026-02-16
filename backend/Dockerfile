# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build typescript
RUN npm run build

# Expose port
EXPOSE 8080

# Environment variables (defaults, override in Fly)
ENV PORT=8080
ENV NODE_ENV=production

# Start command
CMD ["npm", "start"]
