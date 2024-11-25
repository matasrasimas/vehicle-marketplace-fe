# Step 1: Use an official Node.js image as the base image
FROM node:18 AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the app using Vite
RUN npm run build

# Step 7: Use a lightweight server (nginx or serve) to serve the built app
FROM nginx:alpine

# Step 8: Copy the build output to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose port 80 to the outside world
EXPOSE 80

# Step 10: Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
