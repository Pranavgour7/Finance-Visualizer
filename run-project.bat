@echo off
echo === Finance Visualizer Development Starter ===
echo.
echo Cleaning Next.js cache files...

if exist .next (
  echo Removing .next directory...
  rmdir /s /q .next
)

echo.
echo Starting Next.js development server...
echo.
npm run dev
echo.
echo Server stopped. 