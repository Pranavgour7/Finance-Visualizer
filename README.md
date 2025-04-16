# Finance Visualizer

A financial tracking and visualization application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Track income and expenses
- Create and manage budgets by category
- Visualize spending patterns
- Monthly financial summaries
- Responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: (TBD)
- **Deployment**: Vercel

## Deployment Instructions

### Deploy to Vercel

1. **Fork or clone this repository**

2. **Connect to Vercel**:
   - Sign up or log in to [Vercel](https://vercel.com)
   - Create a new project and import your GitHub repository
   - Select the Next.js framework preset

3. **Configure Environment Variables**:
   - Add the following environment variable in the Vercel dashboard:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
   
4. **Deploy**:
   - Click "Deploy" and wait for the build to complete

### MongoDB Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) or specific IPs
5. Get your connection string and add it to Vercel environment variables

## Local Development

1. Clone the repository
   ```
   git clone https://github.com/yourusername/finance-visualizer.git
   cd finance-visualizer
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/finance-visualizer
   ```

4. Run the development server
   ```
   npm run dev
   ```

   **For Windows users:**
   ```
   npm run dev:win
   ```
   
   Or use the provided batch file:
   ```
   run-project.bat
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Production Build

```
npm run build
npm start
```

**For Windows users:**
```
npm run build:win
npm start
```

Or to prepare for Vercel deployment:
```
prepare-for-vercel.bat
```

## Project Structure

- `src/app`