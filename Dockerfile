FROM node:20-alpine

WORKDIR /app

# Copy dependency files first (cache optimization)
COPY package.json package-lock.json ./

RUN npm install

# Copy rest of the app
COPY . .

# Build React app
RUN npm run build

# Serve using a lightweight server
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
