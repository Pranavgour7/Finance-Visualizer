@echo off
echo === Preparing Finance Visualizer for Vercel Deployment ===
echo.

echo Cleaning Next.js cache files...
if exist .next (
  echo Removing .next directory...
  rmdir /s /q .next
)

echo.
echo Cleaning node_modules (optional - press Ctrl+C to skip)...
timeout /t 5
if exist node_modules (
  echo Removing node_modules directory...
  rmdir /s /q node_modules
)

echo.
echo Running clean install...
call npm ci

echo.
echo Building project for production...
call npm run build

echo.
echo === Deployment Preparation Complete ===
echo The project is now ready to be deployed to Vercel.
echo Please use the Vercel CLI or the Vercel web interface to deploy.
echo.
pause 