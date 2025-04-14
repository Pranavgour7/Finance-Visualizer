# MongoDB Setup Guide

This document will help you set up MongoDB for the Finance Visualizer application.

## Option 1: Install MongoDB Locally

### Windows Installation

1. Download MongoDB Community Server from the [official website](https://www.mongodb.com/try/download/community)
2. Follow the installation instructions, choosing "Complete" installation
3. Make sure to check the option "Add MongoDB to the PATH"
4. Run the `setup.bat` script to create the necessary data directories:
   ```
   setup.bat
   ```
5. Start MongoDB using the configuration file:
   ```
   mongod --config mongod.conf
   ```
6. In a new terminal window, start the application:
   ```
   npm run dev
   ```

### macOS/Linux Installation

1. Install MongoDB using your package manager:
   - macOS with Homebrew: `brew install mongodb-community`
   - Ubuntu: `sudo apt install mongodb`
   - Other distros: Follow MongoDB documentation
2. Set up data directories:
   ```
   npm run mongo:setup
   ```
3. Start MongoDB:
   ```
   npm run mongo:start
   ```
4. In a new terminal window, start the application:
   ```
   npm run dev
   ```

## Option 2: Use MongoDB Atlas (Cloud)

If you prefer not to install MongoDB locally, you can use MongoDB Atlas:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (the free tier is sufficient)
3. In the Security tab, create a database user with read/write permissions
4. In the Network Access tab, add your IP address
5. In the Database tab, click "Connect" > "Connect your application"
6. Copy the connection string and update the `.env.local` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/finance-visualizer?retryWrites=true&w=majority
   ```
7. Start your application:
   ```
   npm run dev
   ```

## Troubleshooting

- **Connection errors**: Make sure MongoDB is running before starting the application
- **Port conflicts**: If port 27017 is already in use, edit the `mongod.conf` file to use a different port
- **IPv6 issues**: This app is configured to use IPv4 (127.0.0.1). If you're still having issues, try using a MongoDB Atlas cloud instance instead. 