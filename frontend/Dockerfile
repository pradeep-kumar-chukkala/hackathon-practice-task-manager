# Multi-stage build for React application
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Disable SSL verification for npm (corporate network workaround)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NPM_CONFIG_STRICT_SSL=false

# Copy package files
COPY package*.json ./

# Copy source code
COPY . .

# Clean install dependencies
RUN npm cache clean --force && npm install

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]