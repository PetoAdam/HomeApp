# Use the official Node.js image as a base
FROM node:20.11.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining project files
COPY . .

# Build the project
RUN npm run build

# Create second stage for deployment
FROM node:20.11.0 AS deploy

# Set the working directory in the container
WORKDIR /app

# Copy build from the build container
COPY --from=build /app/build /app/build

# Install serve
RUN npm install -g serve

EXPOSE 3000

# Start
ENTRYPOINT ["serve", "-s", "build"]