# Stage 1: Build the React Application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and compile production build
COPY . .
RUN npm run build

# Stage 2: Serve build assets via Nginx
FROM nginx:1.25-alpine

# Copy built files from build stage to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
