FROM node:22-slim

# better-sqlite3 requires build tools for native compilation
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json .
RUN npm install --omit=dev

COPY src ./src

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "src/server.js"]

