@echo off
echo Setting up MongoDB directories...
mkdir data\db data\log 2>nul
echo Done. You can now run MongoDB with: mongod --config mongod.conf
echo Or start your application with: npm run dev
echo.
echo NOTE: Make sure MongoDB is installed on your computer
echo and added to your PATH environment variable. 