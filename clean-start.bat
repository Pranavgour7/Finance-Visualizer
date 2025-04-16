@echo off
echo Cleaning Next.js cache files...

if exist .next (
  echo Removing .next directory...
  rmdir /s /q .next
)

echo Starting development server...
npm run dev 