# Base image
FROM node:18

# App directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining code
COPY . .

# Build the project
RUN npm run build

# Expose port (agar server 3000 use karta hai)
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
